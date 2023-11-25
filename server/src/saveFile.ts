import { appendFile, readFile, writeFile } from 'fs/promises';
import { State } from './types';
import { sendEventsToAll } from './serverSentEvents';

const ledFile = `${__dirname}/led.json`;
const potFile = `${__dirname}/pot.txt`;

export async function readLedState() {
  const state = await readFile(ledFile, 'utf8');
  return JSON.parse(state) as State
}

export async function updateLedState(led: string, state: boolean) {
  const ledState = await readLedState();
  const currentState = ledState[led];
  if (currentState !== state) {
    ledState[led] = state;
    await writeFile(ledFile, JSON.stringify(ledState, null, 2));
    sendEventsToAll(ledState);
  }
}

export async function toggleLed(led: string) {
  const ledState = await readLedState();
  ledState[led] = !ledState[led];
  await writeFile(ledFile, JSON.stringify(ledState, null, 2));
  return ledState
}

export async function savePotRead(value: number) {
  appendFile(potFile, `${new Date().toDateString()}, ${value}`)
}
