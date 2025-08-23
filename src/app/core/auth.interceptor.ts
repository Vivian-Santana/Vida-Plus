//interceptor usando essa chave token_jwt para enviar automaticamente o JWT no Authorization: Bearer ...
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpInterceptorFn } from '@angular/common/http';


export const authInterceptor: HttpInterceptorFn = (req, next) => {

    // Interceptor lê o token e injeta no header
const token = localStorage.getItem('token_jwt');

  if (token) {
    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(cloned);
  }

  return next(req);
};





/*
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Recupera o token do localStorage
    const token = localStorage.getItem('token_jwt');

    if (token) {
      // Clona a requisição e adiciona o Authorization header
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next.handle(authReq);
    }

    // Se não houver token, segue a requisição normal
    return next.handle(req);
  }
}
  */
