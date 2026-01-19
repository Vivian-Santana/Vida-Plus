//interceptor usando essa chave token_jwt para enviar automaticamente o JWT no Authorization: Bearer ...
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
//console.log('Interceptor interceptando URL:', req.url);
  const router = inject(Router);
  const authService = inject(AuthService);

//Ignora requisições que pedem explicitamente para não usar auth
  // if (req.headers.has('skip-auth')) {
  //   return next(req);
  // }

//Só intercepta chamadas para a API
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  // Interceptor lê o token
const token = localStorage.getItem('token_jwt');

  if (!token) {
    return next(req);
  }

  //Clona e injeta o Authorization
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });
  // Processa a requisição e captura erros de resposta globalmente
  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        console.warn('Erro de autorização detectado:', error.status);
        alert('⚠️ Sua sessão expirou. Por favor, faça login novamente.');
        // Token inválido ou expirado: limpa e redireciona
        setTimeout(() => {
            authService.logout(); // Limpa localStorage e memória
            router.navigate(['/login']);
          }, 2000);
        
      }
      return throwError(() => error);
    })
  );

}


