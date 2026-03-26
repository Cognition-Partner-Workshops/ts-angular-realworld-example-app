import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { JwtService } from '../auth/services/jwt.service';

/**
 * Attaches the JWT authorization header to outgoing requests when a token exists.
 * Second interceptor in the chain, running after {@link apiInterceptor}.
 *
 * Uses the RealWorld API's `Token` scheme (not Bearer) per the spec:
 * `Authorization: Token <jwt>`
 */
export const tokenInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(JwtService).getToken();

  const request = req.clone({
    setHeaders: {
      ...(token ? { Authorization: `Token ${token}` } : {}),
    },
  });
  return next(request);
};
