import { async, fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule} from '../material/material.module';
import { FormBuilder,FormGroup} from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { FormComponent } from './form.component';
import { LinkService } from '../services/link.service';
import { LinkServiceSpy } from '../services/link.service.spec';

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormComponent ],
      imports: [MaterialModule, ReactiveFormsModule]
    })
    .overrideComponent(FormComponent, {
      set: {
        providers: [
          { provide: LinkService, useClass: LinkServiceSpy }
        ]
      }
    }).compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have two input fields', () => {
    expect(fixture.nativeElement.querySelectorAll('input').length).toEqual(2);
  })

  it('should have one text area field', () => {
    expect(fixture.nativeElement.querySelectorAll('textarea').length).toEqual(1);
  })


  it('form value should update from form changes', fakeAsync(() => {
    updateForm('testLink', 'testUrl');
    expect(component.linkFormGroup.value['link']).toEqual('testLink');
    expect(component.linkFormGroup.value['url']).toEqual('testUrl');
  }));


  function updateForm(link, url) {
    component.linkFormGroup.controls['link'].setValue(link);
    component.linkFormGroup.controls['url'].setValue(url);
  }

});