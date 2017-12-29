import { TestBed, inject, async } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { LinkService } from './link.service';
import { Link } from '../model/link';

describe('LinkService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        LinkService,
        MockBackend,
        BaseRequestOptions,
        {
          provide: Http,
          useFactory: (backend, options) => new Http(backend, options),
          deps: [MockBackend, BaseRequestOptions]                    
        }]
    });
  });

  it('should ...', inject([LinkService], (service: LinkService) => {
    expect(service).toBeTruthy();
  }));

  describe('should', () => {
    const mockResponse = [ 
      { 
        description: '',
        gourl: 'fsdfds',
        url: 'sdffsdfsd',
        id: 5722467590995968 } ];

    it('get links from backend', async(
      inject([LinkService, MockBackend], ((service: LinkService, mockBackend: MockBackend) => {
        //respond to a mock connection
        mockBackend.connections.subscribe(conn => {
          conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
        });
        
        service.getLinks().then(links => {
          console.log("links",links);
          expect(links[0].id).toEqual(5722467590995968);
        });
      }))
    ));

    const mockLink = {
        orgId: 5704147139559424,
        userId: 5715921523965952,
        description: 'Test description',
        url: 'Test Url',
        link: 'Test Link',
        id: 0 };


    it('gets link for a given id', async(
      inject([LinkService, MockBackend], ((service: LinkService, mockBackend: MockBackend) => {
        //respond to a mock connection
        mockBackend.connections.subscribe(conn => {
          conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockResponse[0]) })));
        });
        
        service.getLink(5722467590995968).then(link => {
          console.log("link",link);
          expect(link.id).toEqual(5722467590995968);
          expect(link.link).toEqual('fsdfds');
        });
      }))
    ));



    it('make post requests', async(
      inject([LinkService, MockBackend], ((service: LinkService, mockBackend: MockBackend) => {
        //respond to a mock connection
        mockBackend.connections.subscribe(conn => {
          conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockLink) })));
        });
        
        service.(new Link(mockLink.id, mockLink.link, mockLink.url, mockLink.description)).then(link => {
          expect(link.url).toEqual(mockLink.url);
          expect(link.description).toEqual(mockLink.description);
        });
      }))
    ));
  })
});

export class LinkServiceSpy {
  private testLink = new Link(5715921523965952, 'google', 'http://www.google.com', 'description');

  getLinks = jasmine.createSpy('getLinks').and.callFake(
    () => Promise
    
      .resolve(true)
      .then(() => Object.assign({}, this.testLink))
  );

}