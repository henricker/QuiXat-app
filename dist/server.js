"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./http");
require("./websocket/client");
var PORT = process.env.PORT || 3333;
http_1.serverHttp.listen(PORT, function () { return console.log("Server is running on port 3333"); });
