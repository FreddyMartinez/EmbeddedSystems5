import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { readLedState, writeLedState } from './saveFile';

const app = express();
app.use(cors({origin: '*'}));
app.use(bodyParser.json())
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

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});