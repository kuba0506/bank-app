import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html',
  styleUrls: ['./auth-button.component.less'],
})
export class AuthButtonComponent implements OnInit, OnChanges {
  @Input() market: string;
  @Input() locale: string;
  authLink: string;

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

  get isLinkDisabled(): boolean {
    return !this.market || !this.locale ? true : false;
  }

  connect(): void {
    this.authLink = this.authLinkGenerator();
    window.location.href = this.authLink;
  }

  authLinkGenerator(): string {
    const baseURL = 'https://link.tink.com/1.0/transactions/connect-accounts/';
    const clientId = environment.TINK_APP_CLIENT_ID;
    const redirectUri = encodeURIComponent('http://localhost:3000/callback');
    const scope = 'accounts:read,transactions:read,investments:read,user:read';
    const market = this.market;
    const locale = this.locale;
    const test = true;

    return `${baseURL}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&market=${market}&locale=${locale}&test=${test}`;
  }
}
