//interceptor usando essa chave token_jwt para enviar automaticamente o JWT no Authorization: Bearer ...
import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../environments/environment';


export const authInterceptor: HttpInterceptorFn = (req, next) => {

    // Interceptor lê o token e injeta no header
const token = localStorage.getItem('token_jwt');

// Só injeta o token se ele existir e a URL for da API
const isApiRequest = req.url.startsWith(environment.apiUrl);

 // Debug para ver se o token está sendo carregado
  //console.log('Token carregado no interceptor:', token);

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


