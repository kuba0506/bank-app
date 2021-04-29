const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const fetch = require("node-fetch");

const TINK_APP_CLIENT_ID = process.env.TINK_APP_CLIENT_ID;
const TINK_CLIENT_SECRET = process.env.TINK_CLIENT_SECRET;
let tokenGlobal;

// todo
app.use(express.static(path.join(__dirname, "client/build")));
app.use(bodyParser.json());

// Needed to make client-side routing work in production.
// todo fix
// app.get("/*", function (req, res) {
//     res.sendFile(path.join(__dirname, "client/dist/client", "index.html"));
// });

const base = "https://api.tink.se/api/v1";
const transactionURl = "https://api.tink.com/data/v2/transactions";

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
    getAccessToken(req.query.code)
        .then((response) => {
            // save token for other calls
            tokenGlobal = response.access_token;

            res.redirect(`/transactions`);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ message: err.toString() });
        });
});

app.get("/transactions", async function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Content-Length, X-Requested-With");
    try {
        if (!tokenGlobal) throw "Token undefined!";
        const response = await getData(tokenGlobal);
        return res.json({
            response,
        });
    } catch (error) {
        console.error(error);
    }
});

async function handleResponse(response) {
    const json = await response.json();
    if (response.status !== 200) {
        throw new Error(json.errorMessage);
    }
    return json;
}

async function getData(accessToken) {
    // const [transactionData] = await Promise.all([getTransactionData(accessToken)]);

    // return {
    //     transactionData,
    // };
    // const [accountData] = await Promise.all([
    //     getAccountData(accessToken),
    // ]);

    // return {
    //     accountData,
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

// https://docs.tink.com/api#search-query-transactions

// startData: 1577836800000
// endDate: 1609459199000
async function getTransactionData(token) {
    const response = await fetch(base + "/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ limit: 15, endDate: 1609459199000, startDate: 1577836800000, order: "ASC" }),
    });

    return handleResponse(response);
}

// async function getUserData(token) {
//     const response = await fetch(base + "/user", {
//         headers: {
//             Authorization: "Bearer " + token,
//         },
//     });

//     return handleResponse(response);
// }

async function getAccountData(token) {
    const response = await fetch(base + "/accounts/list", {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
    });

    return handleResponse(response);
}

// async function getInvestmentData(token) {
//     const response = await fetch(base + "/investments", {
//         headers: {
//             "Content-Type": "application/json",
//             Authorization: "Bearer " + token,
//         },
//     });

//     return handleResponse(response);
// }

// async function getCategoryData(token) {
//     const response = await fetch(base + "/categories", {
//         headers: {
//             Authorization: "Bearer " + token,
//         },
//     });

//     return handleResponse(response);
// }

// Start the server.
const port = 8080;
app.listen(port, function () {
    console.log("Bank app listening on port " + port);
});
