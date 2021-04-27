import { serverHttp } from './http';
import './websocket/client';

const PORT = process.env.PORT || 3333;

serverHttp.listen(PORT, () => console.log("Server is running on port 3333"));