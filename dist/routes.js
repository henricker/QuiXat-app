"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var router = express_1.Router();
router.get('/', function (request, response) {
    return response.render("html/index.html");
});
router.get('/chat', function (request, response) {
    var _a = request.query, username = _a.username, roomId = _a.roomId;
    if (!username || !roomId)
        return response.render("html/error.html");
    return response.render("html/chat.html");
});
exports.default = router;
