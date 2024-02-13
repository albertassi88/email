import { AfterViewChecked, Component, ElementRef, OnInit } from '@angular/core';
import { ClienteService } from './cliente.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ToastMessageService } from 'src/app/shared/services/toast-message.service';
import { ModalDeletarComponent } from 'src/app/shared/components/modal-deletar/modal-deletar.component';
import { MatDialog } from '@angular/material/dialog';
import { ModalEditarComponent } from 'src/app/shared/components/modal-editar/modal-editar.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import 'bootstrap';
import * as $ from 'jquery'
import { ModalEditarUsuarioComponent } from 'src/app/shared/components/modal-editar-usuario/modal-editar-usuario.component';
import { ModalDeletarBoletoComponent } from 'src/app/shared/components/modal-deletar-boleto/modal-deletar-boleto.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import { ModalAdicionarBoletoComponent } from 'src/app/shared/components/modal-adicionar-boleto/modal-adicionar-boleto.component';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
})
export class ClienteComponent implements OnInit, AfterViewChecked {

  form: FormGroup;
  userLocalStorage: any = localStorage.getItem('user');
  nameUser: any;
  bodyCliente: any;
  bodyClienteOriginal: any;
  statusLoading = true;
  statusLoadingCliente = false;
  statusClientVazio: any;
  types = ['pdf'];
  checkEnviado = false;
  checkNaoEnviado = false;
  statusLoadingClientCenter = false;

  constructor(
    private clienteService: ClienteService,
    private readonly toastMessageService: ToastMessageService,
    private readonly authService: AuthService,
    private readonly formBuilder: FormBuilder,
    private router: Router,
    private elRef: ElementRef,
    public toastr: ToastrService,
    public sharedService: SharedService,
    public dialog: MatDialog
  ) {
    this.form = this.formBuilder.group({
      name: [null],
      company: [null, [Validators.required]],
      cnpjCpf: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      upload: [null, [Validators.required]],
    });
  }
  body: any = {
    name: '',
    company: '',
    cnpjCpf: '',
    email: '',
    upload: []
  };

  bodyFilter: any = {
    pesquisarCliente: '',
    pesquisarVencimento: '',
  };

  ngOnInit() {
    this.nameUser = JSON.parse(this.userLocalStorage);
    this.enviarBoletos();
    const tempoEmMilissegundos = 6 * 60 * 60 * 1000;
    setInterval(() => {
      this.enviarBoletos();
    }, tempoEmMilissegundos)
  }

  ngAfterViewChecked() {
    $(this.elRef.nativeElement).find('[data-toggle="tooltip"]').tooltip({ boundary: 'window' as any });
  }

  verificarTipoArquivoUpload(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Obtém a extensão do arquivo e verifica se é válida
      const nameAux = file.name.split('.');
      const valid = this.types.includes(nameAux[nameAux.length - 1].toLowerCase());
      if (!valid) {
        this.form.patchValue({ upload: null });
        this.toastMessageService.openSnackBar('O arquivo precisa estar no formato .PDF!', 'error');
      }
    }
  }

  gerarIdentificadorUnico(): string {
    //Gerar números e letras aleatórios para o boleto.
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
  }

  escolherArquivos(event: any) {
    const files = event.target.files;
    const data = new Date().getTime();
    const updatedFiles = [];

    for (let i = 0; i < files.length; i++) {
      const uniqueIdentifier = this.gerarIdentificadorUnico();
      const updatedFileName = `${data}${i}${uniqueIdentifier}_${files[i].name}`;

      const updatedFile = new File([files[i]], updatedFileName, { type: files[i].type });
      updatedFiles.push(updatedFile);
    }

    this.body.upload = updatedFiles;
    this.verificarTipoArquivoUpload(files);
  }

  buscarClientes() {
    if (this.userLocalStorage !== null) {
      const user = JSON.parse(this.userLocalStorage);
      const headers = {
        'Authorization': `Bearer ${user.authToken}`
      };
      this.clienteService.genericGetHeaders('user', user._id, headers).subscribe((result: any) => {
          this.bodyCliente = result;
          //cópia original para bodyClienteOriginal
          this.bodyClienteOriginal = JSON.parse(JSON.stringify(this.bodyCliente));
          this.statusLoading = false;
          this.statusClientVazio = result.clients.length === 0 ? true : false;
          $(this.elRef.nativeElement).find('[data-toggle="tooltip"]').tooltip('hide');
        },
        error => {
          console.error(error);
          this.statusLoading = false;
        }
      );
    }
  }

  enviarBoletos() {
    const user = JSON.parse(this.userLocalStorage);
    const headers = {
      'Authorization': `Bearer ${user.authToken}`
    };
    this.clienteService.genericPostId('user/sendEmail', user._id, '', headers).subscribe(result => {
      this.buscarClientes();
    }, error => {
      this.buscarClientes();
      console.error(error);
    })
  }

  atualizarDadosUsuario(bodyUpdate: any) {
    const userAtualizado = JSON.parse(localStorage.getItem('user') || '{}');
    userAtualizado.name = bodyUpdate.name;
    userAtualizado.company = bodyUpdate.company;
    userAtualizado.email = bodyUpdate.email;
    userAtualizado.cnpjCpf = bodyUpdate.cnpjCpf;
    localStorage.setItem('user', JSON.stringify(userAtualizado));
    this.nameUser = userAtualizado;
  }

  btnEnviarCadastro() {
    const user = JSON.parse(this.userLocalStorage);
    const headers = {
      'Authorization': `Bearer ${user.authToken}`
    };
    const formData = new FormData();
    formData.append('name', this.body.name);
    formData.append('company', this.body.company);
    formData.append('cnpjCpf', this.body.cnpjCpf);
    formData.append('email', this.body.email);

    for (let i = 0; i < this.body.upload.length; i++) {
      formData.append('upload', this.body.upload[i]);
    }

    this.statusLoading = true;
    this.clienteService.genericPutId('user', user._id, formData, headers).subscribe(result => {
      this.enviarBoletos();
      this.toastMessageService.openSnackBar('Boleto(s) enviado(s) com sucesso!', 'success');
      this.form.reset();
    }, error => {
      console.error(error);
      this.statusLoading = false;
      this.toastMessageService.openSnackBar("Arquivo inválido!", 'error');
    });
  }

  pegarStatusCliente(event: any) {
    if (event.loading) {
      this.statusLoadingCliente = true;
    } else {
      this.statusLoadingCliente = false;
    }
    if (event.atualizar) {
      this.buscarClientes();
    }
  }

  pegarStatusEditCliente(event: any, oi: any) {
    if (event.loading) {
      this.statusLoadingCliente = true;
    } else {
      this.statusLoadingCliente = false;
    }
    if (event.atualizar) {
      this.buscarClientes();
    }
  }

  editarCliente(item: any) {
    const dialog = this.dialog.open(ModalEditarComponent, {
      width: '480px',
      disableClose: true,
      autoFocus: false,
      data: {
        title: 'Editar cliente',
        dados: item
      },
    });
    dialog.afterClosed().subscribe(result => {
      if (result.submit) {
        const user: any = localStorage.getItem('user');
        const userLocalStorage = JSON.parse(user);
        const headers = {
          'Authorization': `Bearer ${userLocalStorage.authToken}`
        };
        const idClient = `?clientId=${item._id}`;
        const body = {
          name: result?.dados.controls.name.value,
          company: result?.dados.controls.company.value,
          cnpjCpf: result?.dados.controls.cnpjCpf.value,
          email: result?.dados.controls.email.value
        };
        this.statusLoadingClientCenter = true;
        this.sharedService.genericPutParams(`user/client/${userLocalStorage._id}`, idClient, body, headers).subscribe((result: any) => {
          this.toastMessageService.openSnackBar('Cliente editado com sucesso!', 'success');
          this.buscarClientes();
          this.statusLoadingClientCenter = false;
        }, (error) => {
          this.toastMessageService.openSnackBar('Erro ao editar cliente!', 'error');
          this.statusLoadingClientCenter = false;
        })
      }
    })
  }

  excluirCliente(item: any) {
    const dialog = this.dialog.open(ModalDeletarComponent, {
      width: '460px',
      disableClose: true,
      autoFocus: false,
      data: {
        title: 'Deletar cliente',
        dados: item
      },
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        const user: any = localStorage.getItem('user');
        const userLocalStorage = JSON.parse(user);
        const headers = {
          'Authorization': `Bearer ${userLocalStorage.authToken}`
        };
        const idClient = `?clientId=${item._id}`;
        this.statusLoadingClientCenter = true;
        this.sharedService.genericDeleteParams('user/client', userLocalStorage._id, idClient, headers).subscribe((result: any) => {
          this.toastMessageService.openSnackBar('Cliente excluído com sucesso!', 'success');
          this.buscarClientes();
          this.statusLoadingClientCenter = false;
        }, (error) => {
          this.toastMessageService.openSnackBar('Erro ao excluir cliente!', 'error');
          this.statusLoadingClientCenter = false;
        })
      }
    })
  }

  editarDadosUsuario() {
    const dialog = this.dialog.open(ModalEditarUsuarioComponent, {
      width: '480px',
      disableClose: true,
      autoFocus: false,
      data: {
        title: 'Editar cliente',
        dados: this.bodyCliente
      },
    });
    dialog.afterClosed().subscribe(result => {
      if (result.submit) {
        const userLocalStorage = JSON.parse(localStorage.getItem('user') || '{}');
        const headers = {
          'Authorization': `Bearer ${userLocalStorage.authToken}`
        };
        const body = {
          name: result?.dados.controls.name.value,
          company: result?.dados.controls.company.value,
          cnpjCpf: result?.dados.controls.cnpjCpf.value,
          email: result?.dados.controls.email.value
        };
        this.statusLoadingClientCenter = true;
        this.sharedService.genericPut(`user/update/${userLocalStorage._id}`, body, headers).subscribe((result: any) => {
          this.toastMessageService.openSnackBar('Usuário editado com sucesso!', 'success');
          this.atualizarDadosUsuario(body);
          this.buscarClientes();
          this.statusLoadingClientCenter = false;
        }, (error) => {
          this.toastMessageService.openSnackBar('Erro ao editar usuário!', 'error');
          this.statusLoadingClientCenter = false;
        })
      }
    })
  }

  deletarBoleto(event: any, dados: any){
    const dialog = this.dialog.open(ModalDeletarBoletoComponent, {
      width: '480px',
      disableClose: true,
      autoFocus: false,
      data: {
        title: 'Deletar boleto',
        dados: event
      },
    });
    dialog.afterClosed().subscribe(result => {
      if (result) {
        const user: any = localStorage.getItem('user');
        const userLocalStorage = JSON.parse(user);
        const headers = {
          'Authorization': `Bearer ${userLocalStorage.authToken}`
        };
        this.statusLoadingClientCenter = true;
        const params = `?clientId=${dados._id}&ticketId=${event._id}`;
        this.sharedService.genericDeleteParams('user/ticket', userLocalStorage._id, params, headers).subscribe((result: any) => {
          this.toastMessageService.openSnackBar('Boleto excluído com sucesso!', 'success');
          this.buscarClientes();
          this.statusLoadingClientCenter = false;
        }, (error) => {
          this.toastMessageService.openSnackBar('Erro ao excluir boleto!', 'error');
          this.statusLoadingClientCenter = false;
        })
      }
    })
  }

  adicionarBoleto(item: any) {
    const dialog = this.dialog.open(ModalAdicionarBoletoComponent, {
      width: '440px',
      disableClose: true,
      autoFocus: false,
      data: {
        title: 'Adicionar boleto',
      },
    });
    dialog.afterClosed().subscribe(result => {
      if (result.submit) {
        const user: any = localStorage.getItem('user');
        const userLocalStorage = JSON.parse(user);
        const headers = {
          'Authorization': `Bearer ${userLocalStorage.authToken}`
        };
        const idClient = `?clientId=${item._id}`;
        this.statusLoadingClientCenter = true;
        this.sharedService.genericPutParamsId('user/updateTicket', userLocalStorage._id, idClient, result.formData, headers).subscribe((result: any) => {
          this.toastMessageService.openSnackBar('Boleto(s) inserido(s) com sucesso!', 'success');
          this.buscarClientes();
          this.statusLoadingClientCenter = false;
        }, (error) => {
          this.toastMessageService.openSnackBar('Erro ao enviar o boleto!', 'error');
          this.statusLoadingClientCenter = false;
        })
      }
    })
  }

  pesquisarCliente(event: any) {
    this.bodyFilter.pesquisarVencimento = '';
    this.checkEnviado = false;
    this.checkNaoEnviado = false;
    const resultadoFiltrado = this.bodyClienteOriginal.clients.filter((item: any) => item.company.toLowerCase().includes(event.toLowerCase()));
    this.bodyCliente.clients = resultadoFiltrado;
  }

  pesquisarVencimento(event: any) {
    this.bodyFilter.pesquisarCliente = '';
    this.checkEnviado = false;
    this.checkNaoEnviado = false;
    const filtro = event.replace(/(\d{2})(\d{2})(\d{0,4})/, '$1/$2/$3');
    const resultadoFiltrado = this.bodyClienteOriginal.clients.filter((item: any) =>
      item.upload.some((element: any) => element.vencimento.includes(filtro))
    );
    this.bodyCliente.clients = resultadoFiltrado;
  }

  pesquisarBoletoEnviado(event: any) {
    this.bodyFilter.pesquisarVencimento = '';
    this.bodyFilter.pesquisarCliente = '';
    this.checkNaoEnviado = false;
    if (event) {
      const resultadoFiltrado = this.bodyClienteOriginal.clients.filter((item: any) =>
        item.upload.some((element: any) => element.status === true)
      );
      this.bodyCliente.clients = resultadoFiltrado;
    } else {
      this.bodyCliente.clients = this.bodyClienteOriginal.clients;
    }
  }

  pesquisarBoletoNaoEnviado(event: any) {
    this.bodyFilter.pesquisarVencimento = '';
    this.bodyFilter.pesquisarCliente = '';
    this.checkEnviado = false;
    if (event) {
      const resultadoFiltrado = this.bodyClienteOriginal.clients.filter((item: any) =>
        item.upload.some((element: any) => element.status === false)
      );
      this.bodyCliente.clients = resultadoFiltrado;
    } else {
      this.bodyCliente.clients = this.bodyClienteOriginal.clients;
    }
  }

  sair() {
    $(this.elRef.nativeElement).find('[data-toggle="tooltip"]').tooltip('hide');
    this.authService.removerLocalStorage();
    this.router.navigate(['/login']);
  }
}
