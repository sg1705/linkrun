import { Component, OnInit } from '@angular/core';
import { MdDialogRef } from '@angular/material';
import { Link } from '../model/link';

@Component({
  selector: 'form-confirmation-dialog',
  templateUrl: 'form-confirmation-dialog.html',
  styleUrls: ['./form.component.scss'],

})
export class FormConfirmationDialogComponent implements OnInit {

  message:string;
  link: Link;

  constructor(public dialogRef: MdDialogRef<FormConfirmationDialogComponent>) {}

  ngOnInit() {}

  gotoShortLink() {
      var loc = window.location;
      var baseUrl = loc.protocol + "//" + loc.hostname + (loc.port? ":"+loc.port : "")
      window.open(baseUrl + '/'+this.link.link, '_blank')
    //   window.location.href='/'+this.link.link;
  }
}