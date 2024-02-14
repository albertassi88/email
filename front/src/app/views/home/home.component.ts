import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private router: Router,
    private readonly authService: AuthService,
  ) { }

  ngOnInit() {
    this.authService.removerLocalStorage();
  }

  abrirLogin() {
    this.router.navigate(['/login']);
  }

  testarGratis() {
    this.router.navigate(['/cadastrar']);
  }

  abrirWhatsApp() {
    const numeroTelefone = '+5524988694508';

    const url = `https://wa.me/${numeroTelefone}`;
    window.open(url, '_blank');
  }

  abrirInstagram() {
    const nomeUsuario = 'verb.tech';

    const url = `https://www.instagram.com/${nomeUsuario}/`;
    window.open(url, '_blank');
  }

}
