import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-editar-usuario',
  templateUrl: './modal-editar-usuario.component.html',
  styleUrls: ['./modal-editar-usuario.component.scss']
})
export class ModalEditarUsuarioComponent implements OnInit {

  form: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalEditarUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
    ) {
      this.form = this.formBuilder.group({
        name: [null, [Validators.required]],
        company: [null, [Validators.required]],
        cnpjCpf: [null, [Validators.required]],
        email: [null, [Validators.required, Validators.email]],
      });
    }

  ngOnInit() {
  }

  handleClick(data: boolean): void {
    this.dialogRef.close({ submit: data, dados: this.form });
  }

}
