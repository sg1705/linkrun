import { Component, OnInit } from '@angular/core';
import { FormBuilder,FormGroup} from '@angular/forms';
import {MdInputModule} from '@angular/material';
import {MdToolbarModule} from '@angular/material';
import {MdButtonModule} from '@angular/material';
import {MdListModule} from '@angular/material';
import {MdGridListModule} from '@angular/material';
import {MdTabsModule} from '@angular/material';
import { UserService } from '../services/user.service';
import { LinkService } from '../services/link.service';
import { Link } from '../model/link';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [UserService, LinkService],
})
export class FormComponent implements OnInit {

  linkFormGroup: FormGroup;
  submitted = false;

  constructor(fb: FormBuilder, private linkService: LinkService) {
      this.linkFormGroup = fb.group({
        'link': '',
        'url' : '',
        'description': ''
      });
   }

  ngOnInit() {
  }

  onSubmit(l) {
    console.log(l);
    this.linkService.createLink(new Link(0, l.link, l.url, l.decription)).then(link => {
      console.log('link is', link);
    })
  }

}
