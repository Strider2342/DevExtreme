import { ToolbarItem, Properties } from 'devextreme/ui/popup.d';
import url from '../../helpers/getPageUrl';
import { testAccessibility, Configuration } from '../../helpers/accessibility/test';
import { Options } from '../../helpers/generateOptionMatrix';

fixture.disablePageReloads`Accessibility`
  .page(url(__dirname, '../container.html'));

const toolbarItems: ToolbarItem[] = [
  {
    locateInMenu: 'always',
    widget: 'dxButton',
    toolbar: 'top',
    options: { text: 'More info' },
  }, {
    widget: 'dxButton',
    toolbar: 'bottom',
    location: 'before',
    options: { icon: 'email', text: 'Send' },
  }, {
    widget: 'dxButton',
    toolbar: 'bottom',
    location: 'after',
    options: { text: 'Close' },
  },
];

const options: Options<Properties> = {
  width: [300],
  height: [280],
  visible: [true, false],
  showTitle: [true, false],
  title: [undefined, 'title'],
  dragEnabled: [true, false],
  showCloseButton: [true, false],
  toolbarItems: [undefined, toolbarItems],
};

const a11yCheckConfig = {
  rules: {},
};

const configuration: Configuration = {
  component: 'dxPopup',
  a11yCheckConfig,
  options,
};

testAccessibility(configuration);
