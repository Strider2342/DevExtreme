import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

fixture('Chat.Overview')
  .page('http://localhost:8080/')
  .before(async (ctx) => {
    ctx.initialWindowSize = [900, 800];
  });

runManualTest('Chat', 'Overview', ['jQuery', 'React', 'Vue', 'Angular'], (test) => {
  test('Overview', async (t) => {
    await ClientFunction(() => {
      const styleElement = document.createElement('style');
      styleElement.innerHTML = `.dx-chat-typingindicator-circle { animation: none !important; }`;  
      document.head.appendChild(styleElement);
    });

    const { takeScreenshot, compareResults } = createScreenshotsComparer(t);

    await t.typeText('#user-chat .dx-texteditor-input', 'testing');

    await testScreenshot(t, takeScreenshot, 'chat_typing_indicator_appears_in_user_chat.png');

    await t.typeText('#support-chat .dx-texteditor-input', 'testing');

    await testScreenshot(t, takeScreenshot, 'chat_typing_indicator_appears_in_support_chat.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
