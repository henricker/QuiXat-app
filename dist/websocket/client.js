"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var User_1 = require("../entities/User");
var http_1 = require("../http");
var users = new Map();
function userAlreadyExists(username, roomId) {
    var user = Array.from(users.values()).find(function (user) { return user.username === username && user.roomId === roomId; });
    if (user)
        return true;
    return false;
}
http_1.io.on('connection', function (socket) {
    console.log("Client connected, ", socket.id);
});
http_1.io.on('connect', function (socket) {
    socket.on('user_in_room', function (params) {
        var username = params.username, roomId = params.roomId;
        if (userAlreadyExists(username, roomId)) {
            throw new Error('Username already exists in this room');
        }
        socket.join(roomId);
        http_1.io.to(roomId).emit('user_in', { username: username });
        var listUsersRoom = Array.from(users.values()).filter(function (user) { return user.roomId === roomId; });
        http_1.io.to(socket.id).emit('list_users', listUsersRoom);
        var user = new User_1.User();
        user.roomId = roomId;
        user.username = username;
        users.set(socket.id, user);
        socket.on('disconnect', function () {
            console.log("Client disconnected", socket.id);
            users.delete(socket.id);
            socket.leave(roomId);
            http_1.io.to(roomId).emit('user_out', { username: username });
        });
    });
    socket.on('send_message', function (dataMessage) {
        var username = dataMessage.username, message = dataMessage.message, roomId = dataMessage.roomId;
        socket.to(roomId).emit('receive_message', { username: username, message: message });
    });
});
