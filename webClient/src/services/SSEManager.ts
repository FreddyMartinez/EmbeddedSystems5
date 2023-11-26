import { State } from "../components/types"
import { BaseUrl } from "./lightService"

type Observer = (state: State) => void

export class SSEManager {
  sse: EventSource
  observers: Observer[] = []

  constructor() {
    this.sse = new EventSource(`${BaseUrl}/events`)
    this.sse.onmessage = (event) => {
      const state = JSON.parse(event.data) as State;
      this.notify(state)
    }

    this.sse.onerror = () => {
      console.log('Error en conexión');
      this.sse.close()
    }
  }

  subscribe(observer: Observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }

  notify(state: State) {
    this.observers.forEach(o => o(state))
  }
}

export const manager = new SSEManager();
