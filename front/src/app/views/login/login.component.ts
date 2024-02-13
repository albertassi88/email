import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RotasService } from 'src/app/services/rotas/rotas.service';
import { ToastMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form: FormGroup;
  body: any = {
    email: '',
    password: ''
  }
  statusLoading = false;
  hide = true;

  constructor(
    private readonly formBuilder: FormBuilder,
    private authService: AuthService,
    private readonly toastMessageService: ToastMessageService,
    private readonly rotasService: RotasService,
    private router: Router
    ) {
      this.form = this.formBuilder.group({
        email: [null, [Validators.required, Validators.email]],
        password: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.authService.removerLocalStorage();
  }

  loadEsqueceuSenha() {
    this.router.navigate(['/esqueci-a-senha']);
  }

  loadNovoCadastro() {
    this.router.navigate(['/cadastrar']);
  }

  loadEntrar() {
    this.statusLoading = true;
    this.rotasService.genericPost('user/auth', this.body).subscribe((result: any) => {
      if (result) {
        this.authService.salvarLocalStorage(result).then((validation) => {
          if (validation) {
            this.toastMessageService.openSnackBar('Autenticação realizada com sucesso!', 'success');
            localStorage.setItem('jwtAuth', JSON.stringify(true));
            this.router.navigate(["cliente"]);
          } else {
            localStorage.setItem('jwtAuth', JSON.stringify(false));
          }
          this.statusLoading = false;
        });
      }
    }, ({error}) => {
      this.toastMessageService.openSnackBar('Erro ao conectar!', 'error');
      this.statusLoading = false;
    })

  }

}
