import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { ClientFunction } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const USER_CHAT_INPUT_SELECTOR = '#user-chat .dx-texteditor-input';

fixture('Chat.Overview')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 800];
  });

runManualTest('Chat', 'Overview', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Overview', async (t) => {
    await ClientFunction(() => {
      const styleElement = document.createElement('style');
      styleElement.innerHTML = '.dx-chat-typingindicator-circle { animation: none !important; }';
      document.head.appendChild(styleElement);
    })();

    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.typeText(USER_CHAT_INPUT_SELECTOR, 'testing');

    await testScreenshot(t, takeScreenshot, 'chat_typing_indicator.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
