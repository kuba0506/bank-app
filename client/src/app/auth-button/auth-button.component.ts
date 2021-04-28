import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { env } from '../../../../env';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.less'],
})
export class AuthButtonComponent implements OnInit, OnChanges {
  @Input() market: string;
  @Input() locale: string;
  authLink: string;

  constructor() {}

  get isLinkDisabled(): boolean {
    return this.market === '' || this.locale === '' ? true : false;
  }

  connect(): void {
    this.authLink = this.authLinkGenerator();
    window.location.href = this.authLink;
  }

  ngOnInit(): void {
    this.locale = '';
    this.market = '';
  }

  ngOnChanges(changes: SimpleChanges): void {
    for (const propName in changes) {
      // typescript force checking if prop exists in object not in its prototype chain
      if (changes.hasOwnProperty(propName)) {
        const cur = changes[propName].currentValue;
        this[propName] = cur;
      }
    }
  }

  authLinkGenerator(): string {
    const baseURL = 'https://link.tink.com/1.0/authorize/';
    // tslint:disable-next-line:variable-name
    const client_id = env.TINK_APP_CLIENT_ID;
    // tslint:disable-next-line:variable-name
    const redirect_uri = 'http://localhost:3000/callback';
    const scope = 'accounts:read,transactions:read,investments:read,user:read';
    const market = this.market;
    const locale = this.locale;
    const test = true;

    return `${baseURL}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&market=${market}&locale=${locale}&test=${test}`;
  }
}
