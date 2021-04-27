"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var http_1 = require("./http");
require("./websocket/client");
http_1.serverHttp.listen(3333, function () { return console.log("Server is running on port 3333"); });
