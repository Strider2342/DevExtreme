$(async () => {
    const todayDate = new Date();
    const yesterdayDate = (new Date()).setDate(todayDate.getDate() - 1);

    const johnDoe = {
        id: "c94c0e76-fb49-4b9b-8f07-9f93ed93b4f3",
        name: "John Doe",
    };
    
    const supportAgent = {
        id: "d16d1a4c-5c67-4e20-b70e-2991c22747c3",
        name: "Support Agent",
        avatarUrl: "https://raw.githubusercontent.com/DevExpress/DevExtreme/refs/heads/24_2/apps/demos/images/employees/24.png",
    };

    let messages = [
        {
            timestamp: yesterdayDate,
            author: supportAgent,
            text: "Hello, John!\nHow can I assist you today?"
        },
        {
            timestamp: yesterdayDate,
            author: johnDoe,
            text: "Hi, I'm having trouble accessing my account."
        },
        {
            timestamp: yesterdayDate,
            author: johnDoe,
            text: "It says my password is incorrect."
        },
        {
            timestamp: yesterdayDate,
            author: supportAgent,
            text: "I can help with that. Can you please confirm your email address for security purposes?"
        },
        {
            timestamp: yesterdayDate,
            author: johnDoe,
            text: "Sure"
        },
        {
            timestamp: yesterdayDate,
            author: johnDoe,
            text: "john.doe1357"
        },
        {
            timestamp: yesterdayDate,
            author: supportAgent,
            text: "✅ Instructions to regain access have been sent to the email address you provided. "
        },
    ];

    function onMessageEntered({ message }) {
        messages = [...messages, message];

        chat1.renderMessage(message);
        chat2.renderMessage(message);
    }

    function chat1TypingStart() {
        chat2.option('typingUsers', [johnDoe]);
    }

    function chat1TypingEnd() {
        chat2.option('typingUsers', []);
    }

    function chat2TypingStart() {
        chat1.option('typingUsers', [supportAgent]);
    }

    function chat2TypingEnd() {
        chat1.option('typingUsers', []);
    }

    const dayHeaderFormat = 'dd.MM.yyyy';
    const messageTimestampFormat = 'HH:mm';

    const chat1 = $("#chat-1").dxChat({
        width: 420,
        height: 720,
        items: messages,
        user: johnDoe,
        dayHeaderFormat,
        messageTimestampFormat,
        onMessageEntered,
        onTypingStart: chat1TypingStart,
        onTypingEnd: chat1TypingEnd,
    }).dxChat('instance');

    const chat2 = $("#chat-2").dxChat({
        width: 420,
        height: 720,
        items: messages,
        user: supportAgent,
        dayHeaderFormat,
        messageTimestampFormat,
        onMessageEntered,
        onTypingStart: chat2TypingStart,
        onTypingEnd: chat2TypingEnd,
    }).dxChat('instance');
});
