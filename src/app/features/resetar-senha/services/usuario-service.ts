import { Injectable } from "@angular/core";
import { environment } from "../../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { ResetSenhaRequest, ResetSenhaResponse } from "../models/reset-senha.model";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class UsuarioService {

  private readonly API = `${environment.apiUrl}usuarios/reset-senha`;

  constructor(private readonly http: HttpClient) {}

  resetSenha(payload: ResetSenhaRequest): Observable<ResetSenhaResponse> {
      return this.http.patch<ResetSenhaResponse>(this.API, payload);
  }
}
