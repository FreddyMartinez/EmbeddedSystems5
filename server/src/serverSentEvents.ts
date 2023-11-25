import { Request, Response } from 'express';
import { readLedState } from "./saveFile";
import { State } from "./types";

const headers = {
  'Content-Type': 'text/event-stream',
  'Cache-Control': 'no-cache',
};

interface Client {id: number, response: Response}
let clients: Client[] = [];

export async function CreateEventsSubscription(request: Request, response: Response) {
  response.writeHead(200, headers);

  const state = await readLedState();
  response.write(`data: ${JSON.stringify(state)} \n\n`);

  const clientId = Date.now();

  const newClient = {
    id: clientId,
    response
  };

  clients.push(newClient);

  request.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(client => client.id !== clientId);
  });
  
  response.on('close', () => {
    console.log(`${clientId} Connection closed`);
    clients = clients.filter(client => client.id !== clientId);
  });
}

export function sendEventsToAll(state: State) {
  console.log(clients.length)
  clients.forEach((client) =>
    client.response.write(`data: ${JSON.stringify(state)} \n\n`)
  );
}