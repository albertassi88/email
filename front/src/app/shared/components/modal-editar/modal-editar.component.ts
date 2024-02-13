import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-editar',
  templateUrl: './modal-editar.component.html',
  styleUrls: ['./modal-editar.component.scss']
})
export class ModalEditarComponent implements OnInit {

  form: FormGroup;
  @Input() dados: any;
  @Output() enviarStatusEditCliente = new EventEmitter();

  constructor(
    private readonly formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<ModalEditarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required]],
      company: [null, [Validators.required]],
      cnpjCpf: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
    });
  }

  ngOnInit() { }

  handleClick(data: boolean): void {
    this.dialogRef.close({ submit: data, dados: this.form });
  }

}
