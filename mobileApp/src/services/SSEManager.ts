import { State } from '../components/types';
import { getInitialState } from './lightService';

type Observer = (state: State) => void;

class StateNotifier {
  observers: Observer[] = [];

  constructor() {
    setInterval(() => {
      getInitialState().then((state: State) => {
        this.notify(state);
      });
    }, 500);
  }

  subscribe(observer: Observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer) {
    this.observers = this.observers.filter((o) => o !== observer);
  }

  notify(state: State) {
    this.observers.forEach((o) => o(state));
  }
}

export const manager = new StateNotifier();
