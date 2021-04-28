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
    return !this.market || !this.locale ? true : false;
  }

  connect(): void {
    this.authLink = this.authLinkGenerator();
    console.log(this.authLink);
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
    const baseURL = 'https://link.tink.com/1.0/transactions/connect-accounts/';
    // old url
    // const baseURL = 'https://link.tink.com/1.0/authorize/';
    // tslint:disable-next-line:variable-name
    const client_id = env.TINK_APP_CLIENT_ID;
    // tslint:disable-next-line:variable-name
    // encodeURIComponent;
    const redirect_uri = encodeURIComponent('http://localhost:3000/callback');
    const scope = 'accounts:read,transactions:read,investments:read,user:read';
    const market = this.market;
    const locale = this.locale;
    const test = true;

    // 1. transaction api
    // https://link.tink.com/1.0/transactions/connect-accounts/?client_id=1328af2aa95b400e80c3eed06690ef60&redirect_uri=https%3A%2F%2Fconsole.tink.com%2Fcallback&market=GB&locale=en_US&test=true
    // 2. exchange code to access_code on /callback
    // curl -v -X POST https://api.tink.com/api/v1/oauth/token \
    //             -d 'code=00cb730ec2f541cc9630b1f8d2771a38' \
    //             -d 'client_id=${YOUR_CLIENT_ID}' \
    //             -d 'client_secret=${YOUR_CLIENT_SECRET}' \
    //             -d 'grant_type=authorization_code'
    // response contains access_token and refresh_token
    // 3. use access_token to make an api call
    //docs.tink.com/api#transaction-list-transactions
    // demo bank url
    //https://console.tink.com/demobank
    // uk  - u64447502, mcz125

    return `${baseURL}?client_id=${client_id}&redirect_uri=${redirect_uri}&market=${market}&locale=${locale}&test=${test}`;
    // old url
    // return `${baseURL}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&market=${market}&locale=${locale}&test=${test}`;
  }
}
