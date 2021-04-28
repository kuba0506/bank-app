import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';

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
      if (changes.hasOwnProperty(propName)) {
        const chng = changes[propName];
        const cur = chng.currentValue;
        const prev = chng.previousValue;
        this[propName] = cur;
        console.log('onChanges: ', {
          propName,
          cur,
          prev,
          market: this.market,
          locale: this.locale,
        });
      }
    }
  }

  authLinkGenerator(): string {
    // todo
    return `http://localhost:3000/?market=${this.market}&locale=${this.locale}`;
  }
}

// export const AuthorizationLink = ({ locale, market, scope, ssn }) => {
//   const ssnData = ssn ? '&input_username=' + ssn : '';
//   const link =
//     'https://link.tink.com/1.0/authorize/?' +
//     'client_id=' +
//     process.env.REACT_APP_CLIENT_ID +
//     '&redirect_uri=http://localhost:3000/callback' +
//     '&scope=' +
//     scope +
//     ssnData +
//     '&market=' +
//     market +
//     '&locale=' +
//     locale;

//   return <Button href={link}>Connect Bank</Button>;
// };