import axios from 'axios';

export const BaseUrl = `http://localhost`;

export async function toggleLight(state: boolean, light: string) {
  const content = {
    state,
    light
  };
  const res = await axios.post(`${BaseUrl}/led`, content);
  return res.data;
}

export async function getInitialState() {
  const res = await axios.get(`${BaseUrl}/led`);
  return res.data;
}
