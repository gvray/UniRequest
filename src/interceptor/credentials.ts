import type { IRequestInterceptorAxios } from '../types';

/**
 * 开启跨域携带 Cookie（axios 配置 withCredentials）
 */
export function withCredentials(): IRequestInterceptorAxios {
  return (config) => ({ ...config, withCredentials: true }) as any;
}
