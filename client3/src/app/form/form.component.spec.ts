import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";

import { ReactiveFormsModule } from "@angular/forms";

import { FormComponent } from "./form.component";
import { LinkListComponent } from "../link-list/link-list.component";

import { LinkService } from "../services/link.service";
import { UserService } from "../services/user.service";
import { HelperService } from "../services/helper.service";
import { MaterialModule } from "../material/material.module";

import { ClipboardService } from "ngx-clipboard";

describe("FormComponent", () => {
  let component: FormComponent;
  let fixture: ComponentFixture<FormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [LinkService, UserService, HelperService, ClipboardService],
      imports: [
        HttpClientTestingModule,
        MaterialModule,
        ReactiveFormsModule,
        RouterTestingModule
      ],
      declarations: [FormComponent, LinkListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
