import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { RotasService } from 'src/app/services/rotas/rotas.service';
import { ToastMessageService } from 'src/app/shared/services/toast-message.service';

@Component({
  selector: 'app-nova-senha',
  templateUrl: './nova-senha.component.html',
  styleUrls: ['./nova-senha.component.scss']
})
export class NovaSenhaComponent implements OnInit {

  form: FormGroup;
  userLocalStorage: any = localStorage.getItem('user');
  statusLoading = false;
  senhaInvalida = true;
  hide1 = true;
  hide2 = true;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly toastMessageService: ToastMessageService,
    private readonly rotasService: RotasService,
  ) {
    this.form = this.formBuilder.group({
      novaSenha: [null, [Validators.required]],
      repetirSenha: [null, [Validators.required]],
    });
  }

  ngOnInit() {
    this.authService.removerLocalStorage();
  }

  loadCriarNovaSenha() {
    if (this.form.valid && this.form.controls['novaSenha'].value === this.form.controls['repetirSenha'].value) {
      const body = {
        email: this.activatedRoute.snapshot.paramMap.get('email'),
        senha: this.form.controls['novaSenha'].value,
        novaSenha: this.form.controls['repetirSenha'].value
      };
      this.statusLoading = true;
      this.rotasService.genericPost('user/newPassword', body).subscribe(result => {
        this.statusLoading = false;
        this.senhaInvalida = true;
        this.toastMessageService.openSnackBar('Nova senha cadastrada com sucesso!', 'success');
        this.router.navigate(['/login']);
      }, ({error}) => {
        this.toastMessageService.openSnackBar(error?.message, 'error');
        this.statusLoading = false;
        this.senhaInvalida = true;
      })
    } else {
      if (this.form.controls['novaSenha'].value !== this.form.controls['repetirSenha'].value) {
        this.senhaInvalida = false;
        this.toastMessageService.openSnackBar('As senhas devem ser iguais. Tente novamente!', 'error');
      }
      this.statusLoading = false;
    }
    this.form.reset();
  }


}
