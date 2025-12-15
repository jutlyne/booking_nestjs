export {};

declare global {
  interface ResponseInterface<T> {
    data: T;
    messsage?: string;
  }
}
