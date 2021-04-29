const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const fetch = require("node-fetch");
const secrets = require("./env.js");

const TINK_APP_CLIENT_ID = secrets.env.TINK_APP_CLIENT_ID;
const TINK_CLIENT_SECRET = secrets.env.TINK_CLIENT_SECRET;

// todo
app.use(express.static(path.join(__dirname, "client/build")));
app.use(bodyParser.json());

// Needed to make client-side routing work in production.
// todo fix
// app.get("/*", function (req, res) {
//     res.sendFile(path.join(__dirname, "client/dist/client", "index.html"));
// });

const base = "https://api.tink.se/api/v1";
const transactionURl = 'https://api.tink.com/data/v2/transactions';


if (!TINK_APP_CLIENT_ID) {
  // todo exit process
    console.log("\x1b[33m%s\x1b[0m", "Warning: REACT_APP_CLIENT_ID environment variable not set");
    process.exit(1);
}

if (!TINK_CLIENT_SECRET) {
    console.log("\x1b[33m%s\x1b[0m", "Warning: TINK_CLIENT_SECRET environment variable not set");
    process.exit(1);
}

// This is the server API, where the client can post a received OAuth code.
app.get("/callback", function (req, res) {
  console.log("!!!code: ", req.query);
  // console.log("!!!code: ", req.body);
    getAccessToken(req.query.code)
    // getAccessToken(req.body.code)
        .then((response) => {
          res.redirect(`/transactions?token=${response.access_token}`);
        }
        // .then((response) => getData(response.access_token))
        // .then((response) => {
        //     res.json({
        //         response,
        //     });
        //     // res.redirect("/transactions?token=123");
        // })
        )
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: err.toString() });
        });
});

async function handleResponse(response) {
    const json = await response.json();
    if (response.status !== 200) {
        throw new Error(json.errorMessage);
    }
    return json;
}

async function getData(accessToken) {
    // const [transactionData] = await Promise.all([
    //     getTransactionData(accessToken),
    // ]);

    // return {
    //     transactionData,
    // };
    const [accountData, transactionData] = await Promise.all([
        getAccountData(accessToken),
        getTransactionData(accessToken),
    ]);

    return {
        accountData,
        transactionData,
    };
}
// async function getData(accessToken) {
//     const [categoryData, userData, accountData, investmentData, transactionData] = await Promise.all([
//         getCategoryData(accessToken),
//         getUserData(accessToken),
//         getAccountData(accessToken),
//         getInvestmentData(accessToken),
//         getTransactionData(accessToken),
//     ]);

//     return {
//         categoryData,
//         userData,
//         accountData,
//         investmentData,
//         transactionData,
//     };
// }

async function getAccessToken(code) {
    const body = {
        code: code,
        client_id: TINK_APP_CLIENT_ID, // Your OAuth client identifier.
        client_secret: TINK_CLIENT_SECRET, // Your OAuth client secret. Always handle the secret with care.
        grant_type: "authorization_code",
    };

    const response = await fetch(base + "/oauth/token", {
        method: "POST",
        body: Object.keys(body)
            .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(body[key]))
            .join("&"),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        },
    });

    return handleResponse(response);
}

async function getUserData(token) {
    const response = await fetch(base + "/user", {
        headers: {
            Authorization: "Bearer " + token,
        },
    });

    return handleResponse(response);
}

async function getAccountData(token) {
    const response = await fetch(base + "/accounts/list", {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    });

    return handleResponse(response);
}

async function getInvestmentData(token) {
    const response = await fetch(base + "/investments", {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    });

    return handleResponse(response);
}

async function getTransactionData2(token) {
    const response = await fetch(transactionURl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ limit: 5 }),
    });

    return handleResponse(response);
}
// https://docs.tink.com/api#search-query-transactions
async function getTransactionData(token) {
    const response = await fetch(base + "/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ limit: 5 }),
    });

    return handleResponse(response);
}

async function getCategoryData(token) {
    const response = await fetch(base + "/categories", {
        headers: {
            Authorization: "Bearer " + token,
        },
    });

    return handleResponse(response);
}



// Start the server.
const port = 8080;
app.listen(port, function () {
    console.log("Bank app listening on port " + port);
});
