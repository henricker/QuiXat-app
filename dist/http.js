"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.serverHttp = void 0;
var express_1 = __importDefault(require("express"));
var http_1 = __importDefault(require("http"));
var socket_io_1 = require("socket.io");
var path_1 = __importDefault(require("path"));
var routes_1 = __importDefault(require("./routes"));
var app = express_1.default();
app.use(express_1.default.static(path_1.default.join(__dirname, '..', 'public')));
app.set("views", path_1.default.join(__dirname, "..", "public"));
app.engine("html", require('ejs').renderFile);
app.set("view engine", "html");
app.use(express_1.default.json());
app.use(routes_1.default);
var serverHttp = http_1.default.createServer(app); // Http protocol
exports.serverHttp = serverHttp;
var io = new socket_io_1.Server(serverHttp); // Websocket protocol
exports.io = io;
