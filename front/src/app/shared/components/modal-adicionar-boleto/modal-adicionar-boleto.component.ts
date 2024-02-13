import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastMessageService } from '../../services/toast-message.service';

@Component({
  selector: 'app-modal-adicionar-boleto',
  templateUrl: './modal-adicionar-boleto.component.html',
  styleUrls: ['./modal-adicionar-boleto.component.scss']
})
export class ModalAdicionarBoletoComponent implements OnInit {

  form: FormGroup;
  types = ['pdf'];
  body: any = {
    upload: []
  };

  constructor(
    public dialogRef: MatDialogRef<ModalAdicionarBoletoComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly toastMessageService: ToastMessageService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.formBuilder.group({
      upload: [null, [Validators.required]],
    });
  }

  ngOnInit() { }

  gerarIdentificadorUnico(): string {
    //Gerar números e letras aleatórios para o boleto.
    return Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
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

  handleClick(data: boolean): void {
    const formData = new FormData();
    for (let i = 0; i < this.body.upload.length; i++) {
      formData.append('upload', this.body.upload[i]);
    }
    this.dialogRef.close({ submit: data, formData });
  }

}
