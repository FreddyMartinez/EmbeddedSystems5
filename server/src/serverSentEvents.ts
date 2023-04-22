import { Request, Response } from 'express';
import { readLedState } from "./saveFile";
import { State } from "./types";

const headers = {
  'Content-Type': 'text/event-stream',
  'Connection': 'keep-alive',
  'Cache-Control': 'no-cache',
  // 'Access-Control-Allow-Origin': 'http://localhost:3000',
  // 'Access-Control-Allow-Methods': 'GET,POST',
  // 'Access-Control-Allow-Headers': 'Content-Type',
  // 'Access-Control-Allow-Credentials': 'true'
};

interface Client {id: number, response: Response}
let clients: Client[] = [];

export async function CreateEventsSubscription(request: Request, response: Response) {
  response.writeHead(200, headers);
  response.flushHeaders()
  const state = await readLedState();
  response.write(JSON.stringify(state));

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
}

export function sendEventsToAll(state: State) {
  console.log(state)
  console.log(clients.length)
  clients.forEach(client => client.response.write(JSON.stringify(state)))
}