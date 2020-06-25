import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";


export interface DialogData {

}


@Component({
  selector: 'app-chess-promote-dialog',
  templateUrl: './chess-promote-dialog.component.html',
  styleUrls: ['./chess-promote-dialog.component.scss']
})
export class ChessPromoteDialogComponent implements OnInit {

  choose: number;

  constructor(
    public dialogRef: MatDialogRef<ChessPromoteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  setChoose(number: number) {
    this.choose = number;
  }
}
