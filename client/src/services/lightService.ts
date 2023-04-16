import axios from 'axios';

const BaseUrl = `http://192.168.1.144:8080`;

export async function toggleLight(state: boolean, light: string) {
  const content = {
    state,
    light
  };
  const res = await axios.post(`${BaseUrl}/led`, content);
  return res.data;
}