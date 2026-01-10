//interceptor usando essa chave token_jwt para enviar automaticamente o JWT no Authorization: Bearer ...
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';


export const authInterceptor: HttpInterceptorFn = (req, next) => {

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

  return next(authReq);

}


