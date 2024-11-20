import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import notify from 'devextreme/ui/notify';

import { DxChatModule } from 'devextreme-angular';
import { User, Message } from 'devextreme/ui/chat';

if (!/localhost/.test(document.location.host)) {
  enableProdMode();
}

let modulePrefix = '';
// @ts-ignore
if (window && window.config.packageConfigPaths) {
  modulePrefix = '/app';
}

@Component({
  selector: 'demo-app',
  templateUrl: `.${modulePrefix}/app.component.html`,
  styleUrls: [`.${modulePrefix}/app.component.css`],
})
export class AppComponent {
  date: Date = new Date();

  currentUser: User = {
    id: "c94c0e76-fb49-4b9b-8f07-9f93ed93b4f3",
    name: "John Doe",
  };

  supportAgent: User = {
    id: "d16d1a4c-5c67-4e20-b70e-2991c22747c3",
    name: "Support Agent",
    avatarUrl: "../../../../images/petersmith.png",
  };

  messages: Message[] = [];

  constructor() {
    this.date.setHours(0, 0, 0, 0);
    this.messages = [
      {
          timestamp: this.getTimestamp(this.date, -9),
          author: this.supportAgent,
          text: "Hello, John!\nHow can I assist you today?"
      },
      {
          timestamp: this.getTimestamp(this.date, -7),
          author: this.currentUser,
          text: "Hi, I'm having trouble accessing my account."
      },
      {
          timestamp: this.getTimestamp(this.date, -7),
          author: this.currentUser,
          text: "It says my password is incorrect."
      },
      {
          timestamp: this.getTimestamp(this.date, -7),
          author: this.supportAgent,
          text: "I can help with that. Can you please confirm your UserID for security purposes?"
      },
      {
          timestamp: this.getTimestamp(this.date, 1),
          author: this.currentUser,
          text: "john.doe1357"
      },
      {
          timestamp: this.getTimestamp(this.date, 1),
          author: this.supportAgent,
          text: "✅ Instructions to restore access have been sent to the email address registered to your account."
      },
    ];
  }

  getTimestamp(date: Date, offsetMinutes: number = 0): number {
    return date.getTime() + offsetMinutes * 60000;
  }
}

@NgModule({
  imports: [
    BrowserModule,
    DxChatModule,
  ],
  declarations: [AppComponent],
  bootstrap: [AppComponent],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
