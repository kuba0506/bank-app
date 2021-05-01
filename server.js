const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const path = require("path");
const fetch = require("node-fetch");
const cors = require('cors');

const TINK_APP_CLIENT_ID = process.env.TINK_APP_CLIENT_ID;
const TINK_CLIENT_SECRET = process.env.TINK_CLIENT_SECRET;
let token;

app.use(express.static(path.join(__dirname, "client/build")));
app.use(cors()) // will enable cors
app.use(bodyParser.json());

const base = "https://api.tink.se/api/v1";

if (!TINK_APP_CLIENT_ID) {
    console.log("\x1b[33m%s\x1b[0m", "Warning: TINK_APP_CLIENT_ID environment variable not set");
    process.exit(1);
}

if (!TINK_CLIENT_SECRET) {
    console.log("\x1b[33m%s\x1b[0m", "Warning: TINK_CLIENT_SECRET environment variable not set");
    process.exit(1);
}

app.get("/callback", function (req, res) {
    getAccessToken(req.query.code)
        .then((response) => {
            // save token for other calls
            token = response.access_token;

            res.redirect(`/transactions`);
        })
        .catch((error) => {
            console.error("ERROR: ", JSON.stringify(error, null, 4));
            res.status(500).json({ message: error.toString() });
        });
});

app.get("/transactions", async function (req, res) {
    try {
        if (!token) {
            console.error("Token not found!");
        }

        const response = await getData(token);

        return res.json({
            response,
        });
    } catch (error) {
        console.error("ERROR: ", JSON.stringify(error, null, 4));
        return res.redirect("http://localhost:3000/");
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
    const [transactionData] = await Promise.all([getTransactionData(accessToken)]);

    return {
        transactionData,
    };
}

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

async function getTransactionData(token) {
    const response = await fetch(base + "/search", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ limit: 50, endDate: 1609459199000, startDate: 1577836800000, order: "ASC" }),
    });

    return handleResponse(response);
}

// Start the server.
const port = 8080;
app.listen(port, function () {
    console.log("Bank app listening on port " + port);
});
