import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Link } from '../model/link';
import { LinkService } from '../services/link.service';
import { LinkListComponent } from './link-list.component';
import { MaterialModule } from '../material/material.module';

describe('LinkListComponent', () => {
  let component: LinkListComponent;
  let fixture: ComponentFixture<LinkListComponent>;
  let linkServiceSpy: LinkService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinkListComponent ],
      imports: [MaterialModule]
    })
    .overrideComponent(LinkListComponent, {
      set: {
        providers: [
          { provide: LinkService, useClass: LinkServiceSpy }
        ]
      }
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkListComponent);
    component = fixture.componentInstance;
    linkServiceSpy  = fixture.debugElement.injector.get(LinkService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should execute getLinks on init', () => {
    expect(linkServiceSpy.getLinks).toHaveBeenCalledTimes(1);
  })

  it('should fetch 1 link', () => {
    fixture.detectChanges();
    fixture.whenStable().then(() => {
      expect(fixture.componentInstance.links.length).toEqual(1);
    })
    
  })
});


export class LinkServiceSpy {
  testLink = new Link(5715921523965952, 'google', 'http://www.google.com');
  getLinks = jasmine.createSpy('getLinks').and.callFake(
    () => Promise
      .resolve(true)
      .then(() => Object.assign({}, this.testLink))
  );
}