import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RotasService } from 'src/app/services/rotas/rotas.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ToastMessageService } from 'src/app/shared/services/toast-message.service';
@Component({
  selector: 'app-cadastrar',
  templateUrl: './cadastrar.component.html',
  styleUrls: ['./cadastrar.component.scss']
})
export class CadastrarComponent implements OnInit {

  form: FormGroup;
  statusLoading = false;
  senhaInvalida = true;
  hide1 = true;
  hide2 = true;
  body: any = {
    name: '',
    company: '',
    cnpjCpf: '',
    email: '',
    password: '',
    passwordRepeat: '',
    status: '',
    dateRegister: ''
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly rotasService: RotasService,
    private readonly toastMessageService: ToastMessageService,
    private readonly authService: AuthService,
    private router: Router
    ) {
      this.form = this.formBuilder.group({
        nome: [null, [Validators.required]],
        empresa: [null, [Validators.required]],
        cnpjCpf: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
        senha: [null, [Validators.required, Validators.minLength(6)]],
        senhaRepetida: [null, [Validators.required, Validators.minLength(6)]],
      });
  }

  validarLetrasSomente(event: any) {
    let tecla = event.keyCode;
    if (tecla >= 48 && tecla <= 57){
        return false;
    }else{
      return true;
    }
  }

  ngOnInit() {
    this.authService.removerLocalStorage();
  }

  loadCadastrar() {
    if (this.form.valid && this.body.password === this.body.passwordRepeat) {
      this.statusLoading = true;
      this.body['status'] = "testando";
      this.body['dateRegister'] = new Date();
      this.rotasService.genericPost('user', this.body).subscribe(result => {
        this.router.navigate(['/login']);
        this.statusLoading = false;
        this.senhaInvalida = true;
        this.toastMessageService.openSnackBar('Dados inseridos com sucesso!', 'success');
      }, error => {
        this.statusLoading = false;
        this.senhaInvalida = true;
        this.toastMessageService.openSnackBar('Ops! Parece que este e-mail já foi cadastrado. Por favor, escolha outro e-mail.', 'error');
      })
    } else {
      if (this.body.password !== this.body.passwordRepeat) {
        this.senhaInvalida = false;
        this.toastMessageService.openSnackBar('As senhas devem ser iguais. Tente novamente!', 'error');
      }
      this.statusLoading = false;
    }
  }

  voltarLogin() {
    this.router.navigate(['/login']);
  }

}
