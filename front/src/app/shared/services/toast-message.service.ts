import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class ToastMessageService {

  constructor(private readonly snackBar: MatSnackBar) { }

  openSnackBar(message: string, style: string): void {
    this.snackBar.open(message, '', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 5000,
      panelClass: [style],
    });
  }
}
