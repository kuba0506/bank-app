# Bank App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.2.10.

## Installation

The application requires a Tink API developer account.

### Prerequisites

1. Create your developer account at [Tink Console](https://console.tink.com)
2. Follow the [getting started guide](https://docs.tink.com/resources/getting-started/set-up-your-account) to retrieve your `client_id` and `client_secret`
3. Register the redirect URI for the example app (`http://localhost:3000/callback`) in the [list of redirect URIs under your app's settings](https://console.tink.com/overview)


## Running the app locally

1. Install the dependencies.

```
$ npm install
```

2. Set your client identifier and client secret into the following environment variables

```
$ export TINK_APP_CLIENT_ID="<YOUR_CLIENT_ID>"
$ export TINK_CLIENT_SECRET="<YOUR_CLIENT_SECRET>"
```

3. Run both the backend (`server.js`) and the frontend (`client` folder) concurrently:

```
$ npm run dev
```

You should be redirected to the client app on `http://localhost:3000/`. The client runs on port `3000` and the server runs on `8080`.


## Test account

Market - GB
Locale - en_US
Transactions-current account only -  u64447502 / mcz125

