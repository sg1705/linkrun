import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup} from '@angular/forms';
import {MdInputModule} from '@angular/material';
import {MdToolbarModule} from '@angular/material';
import {MdButtonModule} from '@angular/material';
import {MdListModule} from '@angular/material';
import {MdGridListModule} from '@angular/material';
import {MdTabsModule} from '@angular/material';
import { LinkService } from '../services/link.service';
import { Link } from '../model/link';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [LinkService],
})
export class FormComponent implements OnInit {

  linkFormGroup: FormGroup;
  linkId: number = 0;
  mode:string = 'create';

  @ViewChild('link') inputLink: ElementRef;
  @ViewChild('url') inputUrl: ElementRef;

  constructor(
    fb: FormBuilder, 
    private linkService: LinkService,
    private router: Router,
    private activateRoute: ActivatedRoute ) {
      this.linkFormGroup = fb.group({
        'link': '',
        'url' : '',
        'description': ''
      });
      //set linkid in case of /edit
      this.activateRoute.params.subscribe(params => {
        this.linkId = params['id'];
      })
   }

  ngOnInit() {
    this.inputLink.nativeElement.focus();
    if (this.router.url.indexOf('/link/edit') > -1) {
      //set edit mode
      this.mode = 'edit';
      // get the link
      this.linkService.getLink(this.linkId)
      .then(link => {
        this.linkFormGroup.controls['link'].setValue(link.link);
        this.linkFormGroup.controls['link'].disable();
        this.linkFormGroup.controls['url'].setValue(link.url);
        this.linkFormGroup.controls['description'].setValue(link.description);
      })
    } else if (this.router.url.indexOf('/link/create') > -1) {
      this.activateRoute.queryParams.subscribe(params => {
        let link = params['link'];
        console.log(link);
        if (link != null) {
          this.linkFormGroup.controls['link'].setValue(link);
          this.inputUrl.nativeElement.focus();
        }
      });
    }
  }

  onSubmit(l):Promise<boolean> {
    if (this.mode == 'edit') {
      return new Promise((resolve, reject) => {
        var link = this.linkFormGroup.controls['link'].value;
        var url = this.linkFormGroup.controls['url'].value;
        var description = this.linkFormGroup.controls['description'].value;
        this.linkService.updateLink(new Link(this.linkId, link, url, description))
        .then(link => {
          console.log('link updated', link);
          resolve(this.router.navigateByUrl('/links'));
        })
      });
    }
    return new Promise((resolve, reject) => {
      this.linkService.createLink(new Link(0, l.link, l.url, l.description))
      .then(link => {
        console.log('link created', link);
        resolve(this.router.navigateByUrl('/links'));
      })
    });
  }

}
