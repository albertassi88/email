import { EsqueceuComponent } from './views/esqueceu/esqueceu.component';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginComponent } from './views/login/login.component';
import { ClienteComponent } from './views/cliente/cliente.component';
import { CadastrarComponent } from './views/cadastrar/cadastrar.component';
import { AuthGuard } from './guard/auth.guard';
import { NovaSenhaComponent } from './views/nova-senha/nova-senha.component';

const routes: Routes = [
  {
    path: "",
    component: HomeComponent
  },
  {
    path: "cliente",
    component: ClienteComponent,
    canLoad: [AuthGuard],
    canActivate: [AuthGuard],
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "esqueci-a-senha",
    component: EsqueceuComponent,
  },
  {
    path: "cadastrar",
    component: CadastrarComponent,
  },
  {
    path: "alterar-senha/:email",
    component: NovaSenhaComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
