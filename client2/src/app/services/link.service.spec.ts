import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { LinkService } from './link.service';
import { Link } from '../model/link';

describe('LinkService', () => {
  let backend: HttpTestingController;
  let linkService: LinkService;

  const mockResponse = [
    {
      description: '',
      gourl: 'fsdfds',
      url: 'sdffsdfsd',
      id: 5722467590995968
    }
  ];


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LinkService
      ],
      imports: [HttpClientTestingModule]
    });

    backend = TestBed.get(HttpTestingController);
    linkService = TestBed.get(LinkService);
  });

  it('should be created', () => {
    const service: LinkService = TestBed.get(LinkService);
    expect(service).toBeTruthy();
  });


  it('should get a link for a given id', () => {
    linkService.getLink(5722467590995968).then(link => {
      expect(link.id).toEqual(5722467590995968);
      expect(link.link).toEqual('fsdfds');
    });
    backend.expectOne('/__/api/linksv2/link/5722467590995968').flush(mockResponse[0]);
  });

  it('should get links for the given org', () => {
    linkService.getLinks().then(links => {
      expect(links[0].id).toEqual(5722467590995968);
    });
    backend.expectOne('/__/api/linksv2').flush(mockResponse);
  })

  it('should make a post request to create link', () => {
    const mockLink = {
      orgId: 5704147139559424,
      userId: 5715921523965952,
      description: 'Test description',
      url: 'Test Url',
      link: 'Test Link',
      id: 0,
      acl: 0
    };

    linkService.createLink(
      new Link(mockLink.id, mockLink.link, mockLink.url, mockLink.description, mockLink.acl))
      .then(link => {
        expect(link.url).toEqual(mockLink.url);
      })
      const req = backend.expectOne('/__/api/linksv2/create');
      req.flush(mockLink);
      expect(req.request.method).toEqual('POST');
  });
  

  it('should return done when link is deleted', () => {
    linkService.deleteLink(mockResponse[0].id).then(isDeleted => {
      expect(isDeleted).toBeTruthy();
    });
    let req = backend.expectOne('/__/api/linksv2/delete/'+mockResponse[0].id)
    req.flush({done: true});
    expect(req.request.method).toEqual('POST'); 
  });

});
