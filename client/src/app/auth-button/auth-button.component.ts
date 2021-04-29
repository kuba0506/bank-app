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
    console.log(env.TINK_APP_CLIENT_ID);
    window.location.href = this.authLink;
  }

  ngOnInit(): void {
    this.locale = '';
    this.market = '';
    // this.authLink =
    //   "https://link.tink.com/1.0/authorize/?client_id=1328af2aa95b400e80c3eed06690ef60&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fcallback&market=GB&locale=en_US&test=true"
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
    const scope =
      'accounts:read,transactions:read,statistics:read,investments:read,user:read,credentials:read';
    // const scope = 'accounts:read,transactions:read,investments:read,user:read';
    const market = this.market;
    const locale = this.locale;
    const test = true;

    // 1. transaction api
    // https://link.tink.com/1.0/transactions/connect-accounts/?client_id=1328af2aa95b400e80c3eed06690ef60&redirect_uri=https%3A%2F%2Fconsole.tink.com%2Fcallback&market=GB&locale=en_US&test=true
    // 2. exchange code to access_code on /callback
    // curl -v -X POST https://api.tink.com/api/v1/oauth/token \
    //             -d 'code=dd36e3ed87f54a9699e03ec9f5209c29&credentialsId=095739aa882d411faef3aa7b526e1b3f' \
    //             -d 'client_id=1328af2aa95b400e80c3eed06690ef60' \
    //             -d 'client_secret=1541c6c822cf4e80ae2c8a646e519d75' \
    //             -d 'grant_type=authorization_code'
    // response contains access_token and refresh_token
    // 3. use access_token to make an api call
    //docs.tink.com/api#transaction-list-transactions
    // demo bank url
    //https://console.tink.com/demobank
    // gb  - u64447502, mcz125
    // se - u27678322, vrh343
    // code=dd36e3ed87f54a9699e03ec9f5209c29&credentialsId=095739aa882d411faef3aa7b526e1b3f

    return `${baseURL}?client_id=${client_id}&redirect_uri=${redirect_uri}&market=${market}&locale=${locale}&test=${test}`;
    // old url
    // return `${baseURL}?client_id=${client_id}&redirect_uri=${redirect_uri}&scope=${scope}&market=${market}&locale=${locale}&test=${test}`;
  }
}
