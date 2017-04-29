import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MaterialModule} from '../material/material.module';

import { FormComponent } from './form.component';
import { UserService } from '../services/user.service';
import { UserServiceSpy } from '../app.component.spec'

describe('FormComponent', () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormComponent ],
      imports: [MaterialModule]
    })
    .overrideComponent(FormComponent, {
      set: {
        providers: [
          { provide: UserService, useClass: UserServiceSpy }
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

  it('should have three input fields', () => {
    expect(fixture.nativeElement.querySelectorAll('input').length).toEqual(2);
  })

  it('should have one text area field', () => {
    expect(fixture.nativeElement.querySelectorAll('textarea').length).toEqual(1);
  })



});
