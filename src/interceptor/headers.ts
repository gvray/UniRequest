import type { IRequestInterceptorAxios } from '../types';
import type { StringProvider } from './auth';

/**
 * 为非 GET/HEAD 请求自动注入 Content-Type: application/json（若未显式设置）
 */
export function jsonContentType(): IRequestInterceptorAxios {
  return (config) => {
    const method = (config.method || 'GET').toUpperCase();
    const needBody = method !== 'GET' && method !== 'HEAD';
    const headers: Record<string, any> = { ...(config.headers as any) };
    if (needBody && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }
    return { ...config, headers } as any;
  };
}

/**
 * 注入多语言头部，如 Accept-Language: zh-CN
 */
export function acceptLanguage(
  getLocale: StringProvider,
  header = 'Accept-Language'
): IRequestInterceptorAxios {
  return async (config) => {
    const locale = await getLocale();
    if (locale) {
      const headers: Record<string, any> = { ...(config.headers as any) };
      headers[header] = String(locale);
      return { ...config, headers } as any;
    }
    return config as any;
  };
}
