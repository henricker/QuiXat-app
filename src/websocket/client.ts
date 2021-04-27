import { User } from '../entities/User';
import { io } from '../http';

let users: Map<string, User> = new Map<string, User>();

function userAlreadyExists(username: string, roomId: string) {
  const user = Array.from(users.values()).find(user => user.username === username && user.roomId === roomId);

  if(user)
    return true;
  return false;
}

io.on('connection', (socket) => {
  console.log("Client connected, ", socket.id);
});

io.on('connect', (socket) => {

  socket.on('user_in_room', (params) => {
    const { username, roomId } = params;

    if(userAlreadyExists(username, roomId)) {
      throw new Error('Username already exists in this room');
    }

    socket.join(roomId);
    io.to(roomId).emit('user_in', { username });
    
    const listUsersRoom = Array.from(users.values()).filter(user => user.roomId === roomId);
    io.to(socket.id).emit('list_users', listUsersRoom);

    const user = new User();
    user.roomId = roomId;
    user.username = username;

    users.set(socket.id, user);

    socket.on('disconnect', () => {
      console.log("Client disconnected", socket.id);
      users.delete(socket.id);
      socket.leave(roomId);
      io.to(roomId).emit('user_out', { username });
    });
  });

  socket.on('send_message', (dataMessage) => {
    const { username, message, roomId } = dataMessage;

    socket.to(roomId).emit('receive_message', { username, message });
  });
});