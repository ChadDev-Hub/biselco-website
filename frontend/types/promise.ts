


export type PromiseType<T> = {
  status: number;
  error?: string;
  data?: T;
};