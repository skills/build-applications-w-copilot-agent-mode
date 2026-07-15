"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
app_1.app.listen(app_1.port, () => {
    console.log(`Octofit Tracker API listening on port ${app_1.port}`);
    console.log(`API base URL: ${app_1.apiBaseUrl}`);
});
