import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-deletar-boleto',
  templateUrl: './modal-deletar-boleto.component.html',
  styleUrls: ['./modal-deletar-boleto.component.scss']
})
export class ModalDeletarBoletoComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ModalDeletarBoletoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
  }

  handleClick(data: boolean): void {
    this.dialogRef.close(data);
  }


}
