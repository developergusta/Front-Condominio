type Listener = (isLoading: boolean) => void;

class LoadingTracker {
  private count = 0;
  private listeners: Set<Listener> = new Set();

  start() {
    this.count++;
    this.notify();
  }

  stop() {
    this.count = Math.max(0, this.count - 1);
    this.notify();
  }

  get isLoading() {
    return this.count > 0;
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const state = this.isLoading;
    this.listeners.forEach(listener => listener(state));
  }
}

export const loadingTracker = new LoadingTracker();
