import { State } from "../components/types"
import { BaseUrl, getInitialState } from "./lightService"

type Observer = (state: State) => void

class SSEManager {
  sse: EventSource
  observers: Observer[] = []

  constructor() {
    this.sse = new EventSource(`${BaseUrl}/events`)
    this.sse.onmessage = (event) => {
      const state = event.data as State;
      console.log(state);
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

class FakeManager {
  observers: Observer[] = []

  constructor() {
    setInterval(() => {
      getInitialState().then((state: State) => {
        this.notify(state);
      })
    }, 500)
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

export const manager = new FakeManager();