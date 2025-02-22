
import { ReflectiveInjector } from '@angular/core';
import { NG_ASYNC_VALIDATORS, AsyncValidator, AbstractControl } from "@angular/forms";
import { Directive, forwardRef } from "@angular/core";
import { Observable, Observer } from 'rxjs/Rx';
import * as Rx from 'rxjs/Rx';

import { LinkService } from '../services/link.service';

@Directive({
  selector: "[linkNameValidator]",
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: forwardRef(() => LinkNameValidator), multi: true
    }
  ]
})

export class LinkNameValidator implements AsyncValidator {

    constructor(private linkService:LinkService) {
    }

    validate( c : AbstractControl ) : Promise<{[key : string] : any}>|Observable<{[key : string] : any}> {
        return this.checkLinkName(c);
    }

    checkLinkName(control: AbstractControl) : Promise<{[key : string] : any}> {
        return new Promise(resolve => {
            setTimeout(() => {
                this.linkService.isLinkExists(control.value)
                .then(exists => {
                    if (exists) {
                        resolve({linkName: true })
                    } else {
                        resolve(null);
                    }
                })
                .catch(err => {
                    resolve({linkName: true })
                })
            }, 300);
        })
    }
}