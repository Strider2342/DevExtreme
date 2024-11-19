import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { User, Message } from 'devextreme/ui/chat';

@Injectable({
    providedIn: 'root',
})
export class ChatService {
    date: Date = new Date('October 11, 2024, 11:51:00');

    johnDoe: User = {
        id: "c94c0e76-fb49-4b9b-8f07-9f93ed93b4f3",
        name: "John Doe",
    };

    supportAgent: User = {
        id: "d16d1a4c-5c67-4e20-b70e-2991c22747c3",
        name: "Support Agent",
        avatarUrl: "https://raw.githubusercontent.com/DevExpress/DevExtreme/refs/heads/24_2/apps/demos/images/employees/24.png",
    };

    messagesSubject: BehaviorSubject<Message[]> = new BehaviorSubject([
        {
            timestamp: (new Date()).setTime(this.date.getTime()),
            author: this.supportAgent,
            text: "Hello, John!\nHow can I assist you today?"
        } as Message,
        {
            timestamp: (new Date()).setTime(this.date.getTime() + 2 * 60000),
            author: this.johnDoe,
            text: "Hi, I'm having trouble accessing my account."
        } as Message,
        {
            timestamp: (new Date()).setTime(this.date.getTime() + 2 * 60000),
            author: this.johnDoe,
            text: "It says my password is incorrect."
        } as Message,
        {
            timestamp: (new Date()).setTime(this.date.getTime() + 2 * 60000),
            author: this.supportAgent,
            text: "I can help with that. Can you please confirm your email address for security purposes?"
        } as Message,
        {
            timestamp: (new Date()).setTime(this.date.getTime() + 10 * 60000),
            author: this.johnDoe,
            text: "Sure"
        } as Message,
        {
            timestamp: (new Date()).setTime(this.date.getTime() + 10 * 60000),
            author: this.johnDoe,
            text: "🆔 john.doe1357"
        } as Message,
        {
            timestamp: (new Date()).setTime(this.date.getTime() + 10 * 60000),
            author: this.supportAgent,
            text: "✅ Instructions to regain access have been sent to the email address you provided. "
        } as Message,
    ]);

    get messages$(): Observable<Message[]> {
        return this.messagesSubject.asObservable();
    }

    getUsers(): User[] {
        return [this.johnDoe, this.supportAgent];
    }
}
