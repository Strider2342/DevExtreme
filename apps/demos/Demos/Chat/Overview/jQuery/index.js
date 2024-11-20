$(async () => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    date.setHours(0, 0, 0, 0);
    date.setTime(date.getTime() + ((23 * 3600 + 51 * 60) * 1000));

    const currentUser = {
        id: "c94c0e76-fb49-4b9b-8f07-9f93ed93b4f3",
        name: "John Doe",
    };
    
    const supportAgent = {
        id: "d16d1a4c-5c67-4e20-b70e-2991c22747c3",
        name: "Support Agent",
        avatarUrl: "../../../../images/petersmith.png",
    };

    let initialMessages = [
        {
            timestamp: (new Date()).setTime(date.getTime()),
            author: supportAgent,
            text: "Hello, John!\nHow can I assist you today?"
        },
        {
            timestamp: (new Date()).setTime(date.getTime() + 2 * 60000),
            author: currentUser,
            text: "Hi, I'm having trouble accessing my account."
        },
        {
            timestamp: (new Date()).setTime(date.getTime() + 2 * 60000),
            author: currentUser,
            text: "It says my password is incorrect."
        },
        {
            timestamp: (new Date()).setTime(date.getTime() + 2 * 60000),
            author: supportAgent,
            text: "I can help with that. Can you please confirm your UserID for security purposes?"
        },
        {
            timestamp: (new Date()).setTime(date.getTime() + 10 * 60000),
            author: currentUser,
            text: "john.doe1357"
        },
        {
            timestamp: (new Date()).setTime(date.getTime() + 10 * 60000),
            author: supportAgent,
            text: "✅ Instructions to restore access have been sent to the email address registered to your account."
        },
    ];

    function onMessageEntered({ message }) {
        userChat.renderMessage(message);
        supportChat.renderMessage(message);
    }

    function userChatTypingStart() {
        supportChat.option('typingUsers', [currentUser]);
    }

    function userChatTypingEnd() {
        supportChat.option('typingUsers', []);
    }

    function supportChatTypingStart() {
        userChat.option('typingUsers', [supportAgent]);
    }

    function supportChatTypingEnd() {
        userChat.option('typingUsers', []);
    }

    const userChat = $("#user-chat").dxChat({
        width: 760,
        height: 810,
        items: initialMessages,
        user: currentUser,
        onMessageEntered,
        onTypingStart: userChatTypingStart,
        onTypingEnd: userChatTypingEnd,
    }).dxChat('instance');

    const supportChat = $("#support-chat").dxChat({
        width: 760,
        height: 810,
        items: initialMessages,
        user: supportAgent,
        onMessageEntered,
        onTypingStart: supportChatTypingStart,
        onTypingEnd: supportChatTypingEnd,
    }).dxChat('instance');
});
