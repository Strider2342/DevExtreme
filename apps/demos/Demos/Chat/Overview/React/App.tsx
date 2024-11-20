import React, { useState } from 'react';

import { Chat, ChatTypes } from 'devextreme-react/chat';
import { MessageEnteredEvent } from 'devextreme/ui/chat';

import service from './data.ts';

export default function App() {
    const [ userChatTypingUsers, setUserChatTypingUsers ] = useState([]);
    const [ supportChatTypingUsers, setSupportChatTypingUsers ] = useState([]);
    const [ messages, setMessages ] = useState<ChatTypes.Message[]>(service.messages);

    function onMessageEntered(event: MessageEnteredEvent) {
        setMessages(prevMessages => [...prevMessages, event.message]);
    }

    function userChatTypingStart() {
        setSupportChatTypingUsers([service.supportAgent]);
    }
    
    function userChatTypingEnd() {
        setSupportChatTypingUsers([]);
    }
    
    function supportChatTypingStart() {
        setUserChatTypingUsers([service.currentUser]);
    }
    
    function supportChatTypingEnd() {
        setUserChatTypingUsers([]);
    }

    return (
        <>
            <Chat
                width={760}
                height={810}
                user={service.currentUser}
                items={messages}
                onMessageEntered={onMessageEntered}
                onTypingStart={userChatTypingStart}
                onTypingEnd={userChatTypingEnd}
                typingUsers={userChatTypingUsers}
            />
            <Chat
                width={760}
                height={810}
                user={service.supportAgent}
                items={messages}
                onMessageEntered={onMessageEntered}
                onTypingStart={supportChatTypingStart}
                onTypingEnd={supportChatTypingEnd}
                typingUsers={supportChatTypingUsers}
            />
        </>
    );
}
