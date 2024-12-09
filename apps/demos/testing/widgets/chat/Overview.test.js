import { createScreenshotsComparer } from 'devextreme-screenshot-comparer';
import { Selector } from 'testcafe';
import { runManualTest } from '../../../utils/visual-tests/matrix-test-helper';
import { testScreenshot } from '../../../utils/visual-tests/helpers/theme-utils';

const CHAT_INPUT_SELECTOR = '.dx-chat .dx-texteditor-input';

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

    const leftChat = Selector(CHAT_INPUT_SELECTOR).nth(0);
    const rightChat = Selector(CHAT_INPUT_SELECTOR).nth(1);
    
    await t.typeText(leftChat, 'left');
    await testScreenshot(t, takeScreenshot, 'chat_typing_indicator_appears_in_user_chat.png');

    await t.typeText(rightChat, 'right');
    await testScreenshot(t, takeScreenshot, 'chat_typing_indicator_appears_in_support_chat.png');

    await t
      .expect(compareResults.isValid())
      .ok(compareResults.errorMessages());
  });
});
