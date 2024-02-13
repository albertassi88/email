import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RotasService } from 'src/app/services/rotas/rotas.service';
import { ToastMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-esqueceu',
  templateUrl: './esqueceu.component.html',
  styleUrls: ['./esqueceu.component.scss']
})
export class EsqueceuComponent implements OnInit {

  form: FormGroup;
  statusEmail = false;
  emailEnviado = '';
  statusLoading = false;

  constructor(
    private router: Router,
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly toastMessageService: ToastMessageService,
    private readonly rotasService: RotasService,
  ) {
    this.form = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
    });
  }

  ngOnInit() {
    this.authService.removerLocalStorage();
  }

  loadLembrouSenha() {
    this.router.navigate(['/login']);
  }

  loadRecuperarSenha() {
    this.emailEnviado = this.form.value.email;
    const body = {
      email: this.emailEnviado
    }
    this.statusLoading = true;
    this.rotasService.genericPost('user/forgetEmail', body).subscribe(result => {
      this.statusEmail = true;
      this.statusLoading = false;
    }, error => {
      this.statusLoading = false;
    })
  }

  voltarLogin() {
    this.router.navigate(['/login']);
  }

}
