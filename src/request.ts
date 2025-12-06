import RequestClient from './core/RequestClient';
import { IRequestOptions, RequestResult } from './types';
import type { AxiosResponse } from 'axios';

export const getClient = () => {
  return RequestClient.requestClient;
};

export const request = (url: string, opts: IRequestOptions = { method: 'GET' }) => {
  const client = getClient();
  if (!client) throw new Error('Request client not initialized');
  return client.request(url, opts);
};

export const requestSafe = async <T = any>(
  url: string,
  opts: IRequestOptions = { method: 'GET' }
): Promise<RequestResult<T>> => {
  try {
    const res = await request(url, opts);
    const getResponse = (opts as IRequestOptions)?.getResponse === true;
    if (getResponse) {
      const response = res as unknown as AxiosResponse<T>;
      return { data: response.data, response };
    }
    return { data: res as T };
  } catch (error) {
    return { error };
  }
};
