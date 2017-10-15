import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder,FormGroup, Validators, AbstractControl } from '@angular/forms';

import {MdInputModule} from '@angular/material';
import {MdToolbarModule} from '@angular/material';
import {MdButtonModule} from '@angular/material';
import {MdListModule} from '@angular/material';
import {MdGridListModule} from '@angular/material';
import {MdTabsModule} from '@angular/material';
import {MdDialog, MdDialogRef} from '@angular/material';
import { LinkService } from '../services/link.service';
import { UserService } from '../services/user.service';
import { User } from '../model/user';
import { Link } from '../model/link';
import { LinkNameValidator } from './link.validator';
import { LinkListComponent } from '../link-list/link-list.component';
import { FormConfirmationDialogComponent } from './form-confirmation-dialog.component';
import { Observable } from 'rxjs/Rx';
import 'rxjs/Rx';
import * as _ from 'lodash';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
  providers: [LinkService]
})
export class FormComponent implements OnInit {

  linkFormGroup: FormGroup;
  linkId: number = 0;
  mode:string = 'create';
  formTitle:string = 'Create Short Link';
  user: Observable<User>;
  orgName: string;
  orgShortName: string;
  aclMessage:boolean = false;
  shortLink:string = '';

  @ViewChild('link') inputLink: ElementRef;
  @ViewChild('url') inputUrl: ElementRef;
  @ViewChild('linkList') linkList: LinkListComponent;

  linkAclFeature:boolean = false;

  constructor(
    private dialog: MdDialog,
    private fb: FormBuilder, 
    private linkService: LinkService,
    private userService: UserService,
    private router: Router,
    private activateRoute: ActivatedRoute ) {
      this.linkFormGroup = fb.group({
        'link': '',
        'url' : '',
        'description': '',
        'acl': false
      });
      //set linkid in case of /edit
      this.activateRoute.params.subscribe(params => {
        this.linkId = params['id'];
        this.initialize();
      })
      this.user = this.userService.getCurrentUser();
      this.user.subscribe(user => {
        this.orgName = user.orgName;
        this.orgShortName = user.orgShortName;
        console.log(user);
        
        if (user.orgAllowsPublic) {
          this.linkAclFeature = true;
        }
      });    
   }

  ngOnInit() {
    this.inputLink.nativeElement.focus();

    this.linkFormGroup.controls['acl'].valueChanges.subscribe(acl => {
      this.aclMessage = acl;
    })

    this.linkFormGroup.controls['link'].valueChanges.subscribe(link => {
      this.shortLink = link;
    })
    

  }


  private initialize() {
    if (this.router.url.indexOf('/link/edit') > -1) {
      //set edit mode
      this.mode = 'edit';
      this.formTitle = 'Edit Short Link';
      // get the link
      this.linkService.getLink(this.linkId)
      .then(link => {
        this.linkFormGroup.controls['link'].setValue(link.link);
        this.linkFormGroup.controls['link'].disable();
        this.linkFormGroup.controls['url'].setValue(link.url);
        this.linkFormGroup.controls['description'].setValue(link.description);
        this.linkFormGroup.controls['acl'].setValue(link.acl != Link.LINK_ACL_DEFAULT);
      })
    } else if (this.router.url.indexOf('/link/create') > -1) {
      this.activateRoute.queryParams.subscribe(params => {
        let link = params['link'];
        if (link != null) {
          this.linkFormGroup.controls['link'].setValue(link);
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

  private getACL(acl:boolean) {
    if (acl) {
      return Link.LINK_ACL_PUBLIC;
    }
    return Link.LINK_ACL_DEFAULT;
  }


  onSubmit(l):Promise<boolean> {
    if (this.mode == 'edit') {
      return new Promise((resolve, reject) => {
        var link = this.linkFormGroup.controls['link'].value;
        var url = this.linkFormGroup.controls['url'].value;
        var description = this.linkFormGroup.controls['description'].value;
        var acl = this.getACL(this.linkFormGroup.controls['acl'].value);
        this.linkService.updateLink(new Link(this.linkId, link, url, description, acl))
        .then(link => {
          console.log('link updated', link);
          this.reset();
          this.showConfirmationDialog(resolve, 'edited', link);
        })
      });
    } else {
      return new Promise((resolve, reject) => {
        this.linkService.createLink(new Link(0, l.link, l.url, l.description, this.getACL(l.acl)))
        .then(link => {
          console.log('link created', link);
          this.showConfirmationDialog(resolve, 'created', link);
          this.linkList.refreshList();
        })
      });
    }
  }

  private reset() {
    this.linkList.refreshList();
    this.linkFormGroup.reset();
  }

  private showConfirmationDialog(resolve, message, link:Link) {
    let dialogRef = this.dialog.open(FormConfirmationDialogComponent, {
      width: '300px',
      height: '220px', 
      data: { orgName: this.orgName }
    });
    dialogRef.componentInstance.message = message;
    dialogRef.componentInstance.link = link;
    dialogRef.afterClosed().subscribe(result => {
      this.reset();
      resolve(this.router.navigateByUrl('/link/create'));            
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
