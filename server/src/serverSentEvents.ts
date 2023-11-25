import { Request, Response } from "express";
import { readLedState } from "./saveFile";
import { State } from "./types";

const headers = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache",
};

class Client {
  #response: Response;

  constructor(res: Response) {
    this.#response = res;
  }

  sendMessage(message: string) {
    this.#response.write(`data: ${message} \n\n`);
  }

  sendObject(obj: unknown) {
    this.sendMessage(JSON.stringify(obj));
  }

  closeConnection() {
    this.#response.end();
  }
}

let clients = new Map<number, Client>();

export async function CreateEventsSubscription(
  request: Request,
  response: Response
) {
  response.writeHead(200, headers);

  const clientId = Date.now();
  const newClient = new Client(response);

  const state = await readLedState();
  newClient.sendObject(state);

  clients.set(clientId, newClient);

  request.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients.delete(clientId);
  });

  response.on("close", () => {
    console.log(`${clientId} Connection closed`);
    clients.delete(clientId);
  });
}

export function sendEventsToAll(state: State) {
  console.log(clients.size);
  clients.forEach((client) => client.sendObject(state));
}
