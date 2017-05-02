import { Component, OnInit } from '@angular/core';
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
    if (this.router.url.indexOf('/link/edit') > -1) {
      //set edit mode
      this.mode = 'edit';
      // get the link
      this.linkService.getLink(this.linkId)
      .then(link => {
        this.linkFormGroup.controls['link'].setValue(link.link);
        this.linkFormGroup.controls['url'].setValue(link.url);
        this.linkFormGroup.controls['description'].setValue(link.description);
      })

    }
  }

  onSubmit(l):Promise<boolean> {
    if (this.mode == 'edit') {
      return new Promise((resolve, reject) => {
        this.linkService.updateLink(new Link(this.linkId, l.link, l.url, l.description))
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
