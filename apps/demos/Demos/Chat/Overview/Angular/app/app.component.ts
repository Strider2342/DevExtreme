import { NgModule, Component, enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { Observable } from 'rxjs';

import notify from 'devextreme/ui/notify';

import { DxChatModule } from 'devextreme-angular';
import { User, Message } from 'devextreme/ui/chat';
import { ChatService } from './chat.service';

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
  commands: { text: string }[] = [
    { text: 'Call' },
    { text: 'Send message' },
    { text: 'Edit' },
    { text: 'Delete' },
  ];

  messages$: Observable<Message[]>;

  johnDoe: User;
  supportAgent: User;

  constructor(private chatService: ChatService) {
    this.messages$ = chatService.messages$;
    
    [ this.johnDoe, this.supportAgent ] = chatService.getUsers();
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
  providers: [ChatService],
})
export class AppModule { }

platformBrowserDynamic().bootstrapModule(AppModule);
