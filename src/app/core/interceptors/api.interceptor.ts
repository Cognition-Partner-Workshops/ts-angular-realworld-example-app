import { HttpInterceptorFn } from '@angular/common/http';

/**
 * Prepends the RealWorld API base URL to all outgoing HTTP requests.
 * This is the first interceptor in the chain, running before token and error interceptors.
 *
 * Transforms relative paths (e.g. '/articles') into fully qualified URLs
 * (e.g. 'https://api.realworld.show/api/articles').
 */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const apiReq = req.clone({ url: `https://api.realworld.show/api${req.url}` });
  return next(apiReq);
};
