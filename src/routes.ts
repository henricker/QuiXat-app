import { Router } from 'express';

const router = Router();

router.get('/', (request, response) => {
  return response.render("html/index.html");
});

router.get('/chat', (request, response) => {
  const { username, roomId } = request.query;
  if(!username || !roomId)
    return response.render("html/error.html");

  return response.render("html/chat.html");
});

export default router;