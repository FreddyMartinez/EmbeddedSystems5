import express from 'express';
import cors from 'cors';
import { readLedState, toggleLed, writeLedState } from './saveFile';
import { CreateEventsSubscription, sendEventsToAll } from './serverSentEvents';

const app = express();
app.use(cors({origin: '*'}));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
const port = 80;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/led', async (req, res) => {
  const state = await readLedState();
  res.json(state);
});

app.post('/led', async (req, res) => {
  const {state, light} = req.body;
  console.log(`${light} turn ${state ? 'off' : 'on'}`);
  await writeLedState(light, state);
  res.json({newState: !state});
})

app.get('/toggle-led/:led', async (req, res) => {
  const led = req.params.led;
  console.log(`toggle ${led}`);
  const state = await toggleLed(led);
  sendEventsToAll(state);
  res.json(state);
});

app.get('/events', CreateEventsSubscription);

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});