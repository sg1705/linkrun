import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import {
  HttpClientTestingModule,
  HttpTestingController
} from "@angular/common/http/testing";

import { RouterTestingModule } from "@angular/router/testing";
import { LinkListComponent } from "./link-list.component";

import { LinkService } from "../services/link.service";
import { UserService } from "../services/user.service";
import { HelperService } from "../services/helper.service";
import { MaterialModule } from "../material/material.module";

import { ClipboardService } from "ngx-clipboard";

describe("LinkListComponent", () => {
  let component: LinkListComponent;
  let fixture: ComponentFixture<LinkListComponent>;

  let userService: UserService;
  let userServiceSpy;
  let linkService: LinkService;
  let linkServiceSpy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [LinkService, UserService, HelperService, ClipboardService],
      imports: [HttpClientTestingModule, RouterTestingModule, MaterialModule],
      declarations: [LinkListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkListComponent);
    component = fixture.componentInstance;
    userService = TestBed.get(UserService);
    linkService = TestBed.get(LinkService);
    userServiceSpy = spyOn(userService, "getCurrentUser").and.callThrough();
    linkServiceSpy = spyOn(linkService, "getLinks").and.callThrough();
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should execute getUser on init", () => {
    fixture.whenStable().then(() => {
      expect(userServiceSpy).toHaveBeenCalled();
    });
  });
});
