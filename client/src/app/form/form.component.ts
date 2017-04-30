import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  submitted = false;

  constructor(
    fb: FormBuilder, 
    private linkService: LinkService,
    private router: Router ) {
      this.linkFormGroup = fb.group({
        'link': '',
        'url' : '',
        'description': ''
      });
   }

  ngOnInit() {
  }

  onSubmit(l) {
    this.linkService.createLink(new Link(0, l.link, l.url, l.description))
    .then(link => {
      console.log('link created', link);
      this.router.navigateByUrl('/links');
    })
  }

}
