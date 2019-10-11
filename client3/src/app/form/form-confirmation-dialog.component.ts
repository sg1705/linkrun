import { Component, OnInit, Inject, Renderer } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material";
import { Link } from "../model/link";
import { MatSnackBar } from "@angular/material";
import { ClipboardService } from "ngx-clipboard";

@Component({
  selector: "form-confirmation-dialog",
  templateUrl: "form-confirmation-dialog.html",
  styleUrls: ["./form.component.scss"]
})
export class FormConfirmationDialogComponent implements OnInit {
  message: string;
  link: Link;
  shortLink: string;
  publicLink: string;

  constructor(
    public dialogRef: MatDialogRef<FormConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private clipboardService: ClipboardService,
    private renderer: Renderer,
    private snackBar: MatSnackBar
  ) {
    this.shortLink = data.shortLink;
    this.publicLink = data.publicLink;
  }

  ngOnInit() {}

  gotoShortLink() {
    var loc = window.location;
    var baseUrl =
      loc.protocol + "//" + loc.hostname + (loc.port ? ":" + loc.port : "");
    window.open(baseUrl + "/" + this.link.link, "_blank");
    //   window.location.href='/'+this.link.link;
  }

  copyLink() {
    this.clipboardService.copyFromContent(this.shortLink);
    this.openSnackBar("ShortLink copied");
  }

  copyPublicLink() {
    this.clipboardService.copyFromContent(this.publicLink);
    this.openSnackBar("Public ShortLink copied");
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "", {
      duration: 1000
    });
  }
}
