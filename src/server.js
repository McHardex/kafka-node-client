import consumer from './consumer';
import { server as webSocketServer } from 'websocket';
import http from 'http';
import uuidv4 from 'uuid/v4';

const clients = {};

const webSocketsServerPort = 8000;
const server = http.createServer();

server.listen(webSocketsServerPort, () => {
  console.log(`Application listening on port ${webSocketsServerPort}`)
});

const wsServer = new webSocketServer({
  httpServer: server,
  autoAcceptConnections: false
});

wsServer.on('request', async (request) => {
  const userId = uuidv4();
  console.log(`received new connection from ${request.origin}`);
  const connection = await request.accept(null, request.origin);

  clients[userId] = connection;
  console.log(`connected user ${userId}`);

  // send message
  consumer.on('message', async (message) => {
    connection.sendUTF(message.value);
  });
  
  // log error kafka
  consumer.on('error', (error) => {
    console.log(error.message, 'errr');
  });

  // remove client after connection is closed
  connection.on('close', () => {
    console.log(`user ${userId} disconnected`);
    delete clients[userId];
  });
});
