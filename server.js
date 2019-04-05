"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const PORT = process.env.PORT || 8080;
const FILTERED_ENV_VARS = typeof (process.env.ENV_VARS_TO_SHOW) === "string" ? process.env.ENV_VARS_TO_SHOW.split(",") : [];
const SHOW_ALL = process.env.SHOW_ALL === "true";
const ENV_VAR_LIST = Object.keys(process.env);
const ENV_VARS_TO_SHOW = SHOW_ALL ? ENV_VAR_LIST : FILTERED_ENV_VARS;
const HEALTHCHECK_PATH = process.env.HEALTHCHECK_PATH || "/health";
const ERROR_PAGE_REGEX = /^\/([0-9]{3})/;
function logRequest(url, statusCode) {
    console.log(`${new Date().toISOString()} url=${url} status=${statusCode}`);
}
function requestHandler(req, res) {
    if (req.url === HEALTHCHECK_PATH) {
        res.statusCode = 200;
        res.end("OK");
        return;
    }
    if (req.url === "/favicon.ico") {
        res.statusCode = 404;
        res.end("None");
        return;
    }
    if (req.url === "/robots.txt") {
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
    const result = {
        success: true,
        showAll: SHOW_ALL,
        headers: req.headers,
        environment: []
    };
    for (const envVar of ENV_VARS_TO_SHOW) {
        result.environment.push({
            name: envVar,
            value: process.env[envVar],
        });
    }
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(result));
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
