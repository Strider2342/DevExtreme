import DataGrid from 'devextreme-testcafe-models/dataGrid';
import { ClientFunction } from 'testcafe';
import FilterTextBox from 'devextreme-testcafe-models/dataGrid/editors/filterTextBox';
import { createWidget } from '../../../helpers/createWidget';
import url from '../../../helpers/getPageUrl';

fixture.disablePageReloads`Focus`
  .page(url(__dirname, '../../container.html'));

const GRID_SELECTOR = '#container';
const FOCUSED_CLASS = 'dx-focused';

test('Should remove dx-focused class on blur event from the cell', async (t) => {
  const dataGrid = new DataGrid(GRID_SELECTOR);

  const firstCell = dataGrid.getDataCell(0, 1);
  const secondCell = dataGrid.getDataCell(1, 1);

  await t
    .click(firstCell.element)
    .click(secondCell.element);

  await t.expect(firstCell.element().hasClass(FOCUSED_CLASS)).notOk();
  await t.expect(secondCell.element().hasClass(FOCUSED_CLASS)).ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    { A: 0, B: 1, C: 2 },
    { A: 3, B: 4, C: 5 },
    { A: 6, B: 7, C: 8 },
  ],
  editing: {
    mode: 'batch',
    allowUpdating: true,
    startEditAction: 'dblClick',
  },
  onCellClick: (event) => event.component.focus(event.cellElement),
}));

[true, false].forEach((reshapeOnPush) => {
  test(`focused row should have dx-focused class after removing previous focused row (reshapeOnPush=${reshapeOnPush})`, async (t) => {
    const dataGrid = new DataGrid(GRID_SELECTOR);

    await t
      .expect(dataGrid.getDataRow(1).isFocusedRow)
      .ok()
      .expect(dataGrid.getDataRow(1).element.textContent)
      .eql('Item 2');

    await dataGrid.apiPush([{
      type: 'remove',
      key: 1,
    }]);

    await t
      .expect(dataGrid.getDataRow(1).isFocusedRow)
      .ok()
      .expect(dataGrid.getDataRow(1).element.textContent)
      .eql('Item 3');
  }).before(async () => createWidget('dxDataGrid', ClientFunction(() => {
    const { DevExpress } = (window as any);

    const store = new DevExpress.data.ArrayStore({
      data: [
        { id: 0, name: 'Item 1 ' },
        { id: 1, name: 'Item 2' },
        { id: 2, name: 'Item 3' },
        { id: 3, name: 'Item 4' },
        { id: 4, name: 'Item 5' },
      ],
      key: 'id',
    });

    const dataSource = new DevExpress.data.DataSource({ store, reshapeOnPush });

    return {
      columns: ['name'],
      dataSource,
      keyExpr: 'value',
      focusedRowEnabled: true,
      focusedRowKey: 1,
    };
  }, {
    dependencies: { reshapeOnPush },
  })));

  // T1233973
  test(`DataGrid should restore focused row by index after row removed via push API' (reshapeOnPush=${reshapeOnPush})`, async (t) => {
    const dataGrid = new DataGrid(GRID_SELECTOR);

    await t
      .expect(dataGrid.getDataRow(2).isFocusedRow)
      .ok()
      .expect(dataGrid.getDataRow(2).element.textContent)
      .eql('Item 3')
      .expect(dataGrid.option('focusedRowKey'))
      .eql(2)
      .expect(ClientFunction(() => (window as any).onFocusedRowChangedCounter)())
      .eql(1);

    await dataGrid.apiPush([{
      type: 'remove',
      key: 2,
    }]);

    await t
      .expect(dataGrid.getDataRow(2).isFocusedRow)
      .ok()
      .expect(dataGrid.getDataRow(2).element.textContent)
      .eql('Item 4')
      .expect(dataGrid.option('focusedRowKey'))
      .eql(3)
      .expect(ClientFunction(() => (window as any).onFocusedRowChangedCounter)())
      .eql(2);
  }).before(async () => createWidget('dxDataGrid', ClientFunction(() => {
    const { DevExpress } = (window as any);
    const store = new DevExpress.data.ArrayStore({
      data: [
        { id: 0, name: 'Item 1 ' },
        { id: 1, name: 'Item 2' },
        { id: 2, name: 'Item 3' },
        { id: 3, name: 'Item 4' },
        { id: 4, name: 'Item 5' },
      ],
      key: 'id',
    });
    const dataSource = new DevExpress.data.DataSource({ store, reshapeOnPush });

    return {
      columns: ['name'],
      dataSource,
      keyExpr: 'id',
      focusedRowEnabled: true,
      focusedRowKey: 2,
      onFocusedRowChanged: () => {
        const global = window as Window & typeof globalThis
        & { onFocusedRowChangedCounter: number };

        if (!global.onFocusedRowChangedCounter) {
          global.onFocusedRowChangedCounter = 0;
        }
        global.onFocusedRowChangedCounter += 1;
      },
    };
  }, {
    dependencies: { reshapeOnPush },
  }))).after(async () => {
    await ClientFunction(() => {
      delete (window as any).onFocusedRowChangedCounter;
    })();
  });
});

test('DataGrid - FilterRow cell loses focus when focusedRowEnabled is true and editing is in batch mode (T1246926)', async (t) => {
  const dataGrid = new DataGrid('#container');
  const filterEditor = dataGrid.getFilterEditor(0, FilterTextBox).getInput();

  await t
    .click(dataGrid.getDataCell(0, 0).element)
    .click(filterEditor)
    .expect(filterEditor.focused)
    .ok();
}).before(async () => createWidget('dxDataGrid', {
  dataSource: [
    {
      ID: 1,
      FirstName: 'John',
    },
  ],
  keyExpr: 'ID',
  filterRow: {
    visible: true,
  },
  focusedRowEnabled: true,
  editing: {
    mode: 'batch',
    allowUpdating: true,
  },
  columns: ['FirstName'],
}));

['infinite', 'virtual'].forEach((scrollingMode) => {
  test(`Only the initially focused row should be focused while scrolling in ${scrollingMode} mode`, async (t) => {
    const grid = new DataGrid(GRID_SELECTOR);

    // assert
    await t
      .expect(grid.getDataRow(0).isFocusedRow)
      .ok();

    // act
    await grid.scrollBy({ y: 200 });
    await grid.scrollBy({ y: 200 });
    await grid.scrollTo(t, { top: 0 });
    await t.wait(300);

    // assert
    const rows = await grid.apiGetVisibleRows();
    const isFocusedRows = await Promise.all(rows.map((_, i) => grid.getDataRow(i).isFocusedRow));
    const focusedRows = isFocusedRows.filter((isFocusedRow) => isFocusedRow);

    await t
      .expect(focusedRows.length)
      .eql(1)
      .expect(grid.getDataRow(0).isFocusedRow)
      .ok();
  }).before(async () => {
    const initStore = ClientFunction(() => {
      (window as any).myStore = new (window as any).DevExpress.data.ArrayStore({
        key: 'id',
        data: new Array(40).fill(null).map((_, index) => ({ id: index + 1, text: `item ${index + 1}` })),
      });
    });

    await initStore();

    return await createWidget('dxDataGrid', {
      dataSource: {
        key: 'id',
        load(loadOptions) {
          return new Promise((resolve) => {
            setTimeout(() => {
              (window as any).myStore.load(loadOptions).done((data) => {
                resolve(data);
              });
            }, 300);
          });
        },
        totalCount(loadOptions) {
          return (window as any).myStore.totalCount(loadOptions);
        },
      } as any,
      height: 450,
      remoteOperations: true,
      scrolling: {
        mode: scrollingMode as any,
      },
      showBorders: true,
      focusedRowEnabled: true,
      focusedRowKey: 1,
    });
  });
});
