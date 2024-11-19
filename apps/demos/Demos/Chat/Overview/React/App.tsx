import React from 'react';

import { Chat, ChatTypes } from 'devextreme-react/chat';

export default function App() {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    date.setHours(0, 0, 0, 0);
    date.setTime(date.getTime() + ((23 * 3600 + 51 * 60) * 1000));

    const johnDoe: ChatTypes.User = {
        id: "c94c0e76-fb49-4b9b-8f07-9f93ed93b4f3",
        name: "John Doe",
    };

    const supportAgent: ChatTypes.User = {
        id: "d16d1a4c-5c67-4e20-b7v0e-2991c22747c3",
        name: "Support Agent",
        avatarUrl: "http://az-jsserver.corp.devexpress.com:81/Angular/Demos-24.2/WidgetsGallery/JSDemos/images/petersmith.png",
    };

    const messages: ChatTypes.Message[] = [
        {
            timestamp: (new Date()).setTime(date.getTime()),
            author: supportAgent,
            text: "Hello, John!\nHow can I assist you today?"
        },
        {
            timestamp: (new Date()).setTime(date.getTime() + 2 * 60000),
            author: johnDoe,
            text: "Hi, I'm having trouble accessing my account."
        },
        {
            timestamp: (new Date()).setTime(date.getTime() + 2 * 60000),
            author: johnDoe,
            text: "It says my password is incorrect."
        },
        {
            timestamp: (new Date()).setTime(date.getTime() + 2 * 60000),
            author: supportAgent,
            text: "I can help with that. Can you please confirm your UserID for security purposes?"
        },
        {
            timestamp: (new Date()).setTime(date.getTime() + 10 * 60000),
            author: johnDoe,
            text: "john.doe1357"
        },
        {
            timestamp: (new Date()).setTime(date.getTime() + 10 * 60000),
            author: supportAgent,
            text: "✅ Instructions to restore access have been sent to the email address registered to your account."
        },
    ];

    return (
        <>
            <Chat
                width={760}
                height={810}
                user={johnDoe}
                items={messages}
            />
            <Chat
                width={760}
                height={810}
                user={supportAgent}
                items={messages}
            />
        </>
    );
}
