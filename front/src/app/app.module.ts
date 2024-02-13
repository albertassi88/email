import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { MatCardModule } from '@angular/material/card';
import { ClienteComponent } from './views/cliente/cliente.component';
import { EsqueceuComponent } from './views/esqueceu/esqueceu.component';
import { CadastrarComponent } from './views/cadastrar/cadastrar.component';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import {ToastrModule} from 'ngx-toastr'
import { AuthService } from './services/auth/auth.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogActions, MatDialogContent, MatDialogModule, MatDialogTitle } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import {CdkMenu, CdkMenuItem, CdkMenuTrigger, CdkMenuModule} from '@angular/cdk/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToastMessageService } from './shared/services/toast-message.service';
import { LogoComponent } from './shared/components/logo/logo.component';
import { ModalDeletarComponent } from './shared/components/modal-deletar/modal-deletar.component';
import { ModalEditarComponent } from './shared/components/modal-editar/modal-editar.component';
import { ModalEditarUsuarioComponent } from './shared/components/modal-editar-usuario/modal-editar-usuario.component';
import { ModalDeletarBoletoComponent } from './shared/components/modal-deletar-boleto/modal-deletar-boleto.component';
import { NovaSenhaComponent } from './views/nova-senha/nova-senha.component';
import { LetrasDirective } from './utils/directives/letras.directive';
import { ModalAdicionarBoletoComponent } from './shared/components/modal-adicionar-boleto/modal-adicionar-boleto.component';

@NgModule({
  declarations: [
    AppComponent,
      ClienteComponent,
      LoadingComponent,
      ModalDeletarComponent,
      ModalEditarComponent,
      ModalEditarUsuarioComponent,
      ModalDeletarBoletoComponent,
      ModalAdicionarBoletoComponent,
      LogoComponent,
      HomeComponent,
      NovaSenhaComponent,
      LoginComponent,
      EsqueceuComponent,
      CadastrarComponent,
      LetrasDirective
  ],
  imports: [
    BrowserModule,
    MatTooltipModule,
    MatSelectModule,
    CdkMenuModule,
    CdkMenuTrigger,
    CdkMenu,
    CdkMenuItem,
    MatRadioModule,
    MatCheckboxModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    NgxMaskDirective,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatInputModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    MatCardModule,
    FormsModule
  ],
  providers: [
    AuthService,
    ToastMessageService,
    provideNgxMask({})
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
