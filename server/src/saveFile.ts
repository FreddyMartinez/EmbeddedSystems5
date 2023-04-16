import { appendFile, readFile, writeFile } from 'fs/promises';

const ledFile = `${__dirname}/led.json`;
const potFile = `${__dirname}/pot.txt`;

export async function readLedState() {
  const state = await readFile(ledFile, 'utf8');
  return JSON.parse(state)
}

export async function writeLedState(led: string, state: boolean) {
  const ledState = await readLedState();
  ledState[led] = state;
  await writeFile(ledFile, JSON.stringify(ledState, null, 2));
}

export async function savePotRead(value: number) {
  appendFile(potFile, `${new Date().toDateString()}, ${value}`)
}
