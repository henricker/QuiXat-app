import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import router from './routes';

const app = express();

app.use(express.static(path.join(__dirname, '..', 'public')));
app.set("views", path.join(__dirname, "..", "public"));
app.engine("html", require('ejs').renderFile);
app.set("view engine", "html");
app.use(express.json());
app.use(router);

const serverHttp = http.createServer(app); // Http protocol
const io = new Server(serverHttp); // Websocket protocol

export { serverHttp, io };

