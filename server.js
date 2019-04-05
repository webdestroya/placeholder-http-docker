"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const PORT = process.env.PORT || 8080;
const PLACEHOLDER_SHOW_ENV = process.env.PLACEHOLDER_SHOW_ENV || "true";
const PLACEHOLDER_HEALTHCHECK = process.env.PLACEHOLDER_HEALTHCHECK || "/health";
const PLACEHOLDER_APP_NAME = process.env.PLACEHOLDER_APP_NAME || "Placeholder";
const PLACEHOLDER_ROBOTS = (process.env.PLACEHOLDER_ROBOTS || "true") === "true";
const FILTERED_ENV_VARS = typeof (process.env.PLACEHOLDER_ENV_LIST) === "string" ? process.env.PLACEHOLDER_ENV_LIST.split(",") : [];
const PLACEHOLDER_ENV_LIST = PLACEHOLDER_SHOW_ENV === "true" ? Object.keys(process.env) : FILTERED_ENV_VARS;
const PLACEHOLDER_BODY = `
<html>
<head>
<title>${PLACEHOLDER_APP_NAME}</title>
</head>
<body>
<h1>Welcome to ${PLACEHOLDER_APP_NAME}!</h1>
<p>This is just a placeholder</p>
</body>
</html>
`;
const ERROR_PAGE_REGEX = /^\/([0-9]{3})/;
function logRequest(url, statusCode) {
    console.log(`${new Date().toISOString()} url=${url} status=${statusCode}`);
}
function requestHandler(req, res) {
    if (req.url === PLACEHOLDER_HEALTHCHECK) {
        res.statusCode = 200;
        res.end("OK");
        return;
    }
    if (req.url === "/favicon.ico") {
        res.statusCode = 404;
        res.end("None");
        return;
    }
    if (PLACEHOLDER_ROBOTS && req.url === "/robots.txt") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        res.end("User-Agent: *\nDisallow: /\n");
        return;
    }
    const errorMatch = ERROR_PAGE_REGEX.exec(req.url || "");
    if (errorMatch) {
        const errorCode = parseInt(errorMatch[1], 10);
        res.statusCode = errorCode;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ error: true, errorCode }));
        logRequest(req.url, errorCode);
        return;
    }
    if (req.url === "/headers") {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({
            success: true,
            headers: req.headers
        }));
        logRequest(req.url, 200);
        return;
    }
    if (PLACEHOLDER_SHOW_ENV !== "false" && req.url === "/environment") {
        const result = {
            success: true,
            showAll: PLACEHOLDER_SHOW_ENV === "true",
            headers: req.headers,
            environment: []
        };
        for (const envVar of PLACEHOLDER_ENV_LIST) {
            result.environment.push({
                name: envVar,
                value: process.env[envVar],
            });
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify(result));
        logRequest(req.url, 200);
        return;
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "text/html");
    res.end(PLACEHOLDER_BODY);
    logRequest(req.url, 200);
}
const SERVER = http_1.createServer(requestHandler);
function listeningListener(error) {
    if (error) {
        return console.log('something bad happened', error);
    }
    console.log(`server is listening on ${PORT}`);
}
SERVER.listen(PORT, 1024, listeningListener);
