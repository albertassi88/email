import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  salvarLocalStorage(user: any): Promise<any> {
    return new Promise((resolve) => {
      const userObject = {
        cnpjCpf: user.usuario.cnpjCpf,
        company: user.usuario.company,
        dateRegister: user.usuario.dateRegister,
        email: user.usuario.email,
        name: user.usuario.name,
        status: user.usuario.status,
        _id: user.usuario._id,
        authToken: user.token,
      };

      localStorage.setItem('user', JSON.stringify(userObject));
      resolve(true);
    });
  }

  autenticarUsuario(): Promise<boolean> {
    return new Promise((resolve) => {
      const user: any = localStorage.getItem('jwtAuth');
      const userAuth = JSON.parse(user);
      if (userAuth === true) {
        resolve(true);
      }
      resolve(false);
    });
  }

  removerLocalStorage(): Promise<any> {
    return new Promise<any>((resolve) => {
      sessionStorage.clear();
      localStorage.clear();
      resolve(true);
    });
  }
}
