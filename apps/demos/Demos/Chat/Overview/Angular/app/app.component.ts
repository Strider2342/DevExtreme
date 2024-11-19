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

  johnDoe: User = {
    id: "c94c0e76-fb49-4b9b-8f07-9f93ed93b4f3",
    name: "John Doe",
  };

  supportAgent: User = {
    id: "d16d1a4c-5c67-4e20-b70e-2991c22747c3",
    name: "Support Agent",
    avatarUrl: "http://az-jsserver.corp.devexpress.com:81/Angular/Demos-24.2/WidgetsGallery/JSDemos/images/petersmith.png",
  };

  messages: Message[] = [
    {
        timestamp: (new Date()).setTime(this.date.getTime()),
        author: this.supportAgent,
        text: "Hello, John!\nHow can I assist you today?"
    },
    {
        timestamp: (new Date()).setTime(this.date.getTime() + 2 * 60000),
        author: this.johnDoe,
        text: "Hi, I'm having trouble accessing my account."
    },
    {
        timestamp: (new Date()).setTime(this.date.getTime() + 2 * 60000),
        author: this.johnDoe,
        text: "It says my password is incorrect."
    },
    {
        timestamp: (new Date()).setTime(this.date.getTime() + 2 * 60000),
        author: this.supportAgent,
        text: "I can help with that. Can you please confirm your UserID for security purposes?"
    },
    {
        timestamp: (new Date()).setTime(this.date.getTime() + 10 * 60000),
        author: this.johnDoe,
        text: "john.doe1357"
    },
    {
        timestamp: (new Date()).setTime(this.date.getTime() + 10 * 60000),
        author: this.supportAgent,
        text: "✅ Instructions to restore access have been sent to the email address registered to your account."
    },
  ];

  constructor() {
    this.date.setDate(this.date.getDate() - 1);
    this.date.setHours(0, 0, 0, 0);
    this.date.setTime(this.date.getTime() + ((23 * 3600 + 51 * 60) * 1000));
  }

  showNotify(text: string) {
    notify(`The "${text}" button is clicked.`);
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
