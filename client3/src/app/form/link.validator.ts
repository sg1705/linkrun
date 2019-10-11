import {
  NG_ASYNC_VALIDATORS,
  AsyncValidator,
  AbstractControl
} from "@angular/forms";
import { Directive, forwardRef } from "@angular/core";
import { Observable } from "rxjs";

import { LinkService } from "../services/link.service";

@Directive({
  selector: "[linkNameValidator]",
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: LinkNameValidator,
      multi: true
      //   useExisting: forwardRef(() => LinkNameValidator), multi: true
    }
  ]
})
export class LinkNameValidator implements AsyncValidator {
  constructor(private linkService: LinkService) {}

  validate(
    c: AbstractControl
  ): Promise<{ [key: string]: any }> | Observable<{ [key: string]: any }> {
    return this.checkLinkName(c);
  }

  checkLinkName(control: AbstractControl): Promise<{ [key: string]: any }> {
    return new Promise(resolve => {
      setTimeout(() => {
        this.linkService
          .isLinkExists(control.value)
          .then(exists => {
            if (exists) {
              resolve({ linkName: true });
            } else {
              resolve(null);
            }
          })
          .catch(err => {
            resolve({ linkName: true });
          });
      }, 300);
    });
  }
}
