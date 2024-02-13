import { Component, Inject, Input, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-modal-deletar',
  templateUrl: './modal-deletar.component.html',
  styleUrls: ['./modal-deletar.component.scss']
})
export class ModalDeletarComponent implements OnInit {

  @Input() dados: any;

  constructor(
    public dialogRef: MatDialogRef<ModalDeletarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {}

  handleClick(data: boolean): void {
    this.dialogRef.close(data);
  }

}
