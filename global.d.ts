export {};

declare module '*.png';

declare global {
  // requestIdleCallback — not universally typed in older TS lib.dom.d.ts versions
  function requestIdleCallback(
    callback: IdleRequestCallback,
    options?: IdleRequestOptions
  ): number;
  function cancelIdleCallback(handle: number): void;
  interface IdleRequestCallback {
    (deadline: IdleDeadline): void;
  }
  interface IdleDeadline {
    readonly didTimeout: boolean;
    timeRemaining(): DOMHighResTimeStamp;
  }
  interface IdleRequestOptions {
    timeout?: number;
  }
}
