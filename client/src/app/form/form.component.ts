import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup, Validators, AbstractControl } from '@angular/forms';
import {MdInputModule, MdError} from '@angular/material';
import {MdToolbarModule} from '@angular/material';
import {MdButtonModule} from '@angular/material';
import {MdListModule} from '@angular/material';
import {MdGridListModule} from '@angular/material';
import {MdTabsModule} from '@angular/material';
import { LinkService } from '../services/link.service';
import { Link } from '../model/link';
import { LinkNameValidator } from './link.validator';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';

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
        if (link != null) {
          this.linkFormGroup.controls['link'].setValue(link);
          this.inputUrl.nativeElement.focus();
        }
      });
    }
    
    this.setupValidation();
  }


  private setupValidation() {
    this.linkFormGroup.statusChanges.subscribe(data => {
      for (const field in this.formErrors) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const control = this.linkFormGroup.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
    })
  }

  onSubmit(l):Promise<boolean> {
    if (this.mode == 'edit') {
      return new Promise((resolve, reject) => {
        var link = this.linkFormGroup.controls['link'].value;
        var url = this.linkFormGroup.controls['url'].value;
        var description = this.linkFormGroup.controls['description'].value;
        this.linkService.updateLink(new Link(this.linkId, link, url, description, 0))
        .then(link => {
          console.log('link updated', link);
          resolve(this.router.navigateByUrl('/links'));
        })
      });
    }
    return new Promise((resolve, reject) => {
      this.linkService.createLink(new Link(0, l.link, l.url, l.description,0))
      .then(link => {
        console.log('link created', link);
        resolve(this.router.navigateByUrl('/links'));
      })
    });
  }


  validationMessages = {
    'link': {
      'required':           'Link is required.',
      'minlength':          'Link must be at least 2 characters long.',
      'linkName':           'Link by this name already exists'
    },
    'url': {
      'required':   'Url is required.',
      'minlength':  'Url must be at least 2 characters long.',
    }
  };

  formErrors = {
    'link': '',
    'url': ''
  };

}
