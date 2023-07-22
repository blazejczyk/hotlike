import config from './config';
import { getToken } from '../services/storage';

type TMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type TRequestOptions = {
  method: TMethod;
  path: string;
  params?: Record<string, string>;
  body?: any;
  isPublic?: boolean;
};

type TApiResponseSuccess<TData> = {
  data: TData;
};

type TApiResponseFailure = {
  error: {
    code: string;
    message: string;
    details: any;
  };
};

type TApiResponse<TData> = TApiResponseSuccess<TData> | TApiResponseFailure;

export function get<TData>(path: string, params: Record<string, string> = {}, isPublic: boolean = false): Promise<TData> {
  return request<TData>({
    method: 'GET',
    path,
    params,
    isPublic,
  });
}

export function post<TData>(path: string, body: any = undefined, params: Record<string, string> = {}, isPublic: boolean = false): Promise<TData> {
  return request<TData>({
    method: 'POST',
    path,
    params,
    body,
    isPublic,
  });
}

export function put<TData>(path: string, body: any = undefined, params: Record<string, string> = {}, isPublic: boolean = false): Promise<TData> {
  return request<TData>({
    method: 'PUT',
    path,
    params,
    body,
    isPublic,
  });
}

export function delete_<TData>(path: string, params: Record<string, string> = {}, isPublic: boolean = false): Promise<TData> {
  return request<TData>({
    method: 'DELETE',
    path,
    params,
    isPublic,
  });
}

async function request<TData>({ method, path, params, body, isPublic }: TRequestOptions): Promise<TData> {
  const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(isPublic ? {} : await getAuthorizationHeaders()),
  };
  const qs = (params && Object.keys(params).length) ? `?${new URLSearchParams(params).toString()}` : '';
  const url = `${config.api.url}/${path}${qs}`;
  const options = { headers, method, body: JSON.stringify(body) };
  const serverResponse = await fetch(url, options);
  const apiResponse = await getApiResponse<TData>(serverResponse);
  if (serverResponse.ok) {
    return (apiResponse as TApiResponseSuccess<TData>).data;
  }
  throw (apiResponse as TApiResponseFailure).error;
}

export async function getAuthorizationHeaders(): Promise<Record<string, string>> {
  const token = await getToken();
  if (!token) {
    throw new Error('Token not found.');
  }
  return {
    'Authorization': `Bearer ${token}`,
  };
}

async function getApiResponse<TData>(serverResponse: Response): Promise<TApiResponse<TData>> {
  try {
    return await serverResponse.json();
  } catch (err) {
    throw new Error('Unexpected error.');
  }
}
