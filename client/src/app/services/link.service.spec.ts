import { TestBed, inject, async } from '@angular/core/testing';
import { BaseRequestOptions, Http, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend } from '@angular/http/testing';
import { LinkService } from './link.service';

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

  describe('Get links from backend', () => {
    const mockResponse = [ 
      { 
        orgId: 5704147139559424,
        userId: 5715921523965952,
        description: '',
        gourl: 'fsdfds',
        url: 'sdffsdfsd',
        id: 5722467590995968 } ];

    it('should get links from backend', async(
      inject([LinkService, MockBackend], ((service: LinkService, mockBackend: MockBackend) => {
        //respond to a mock connection
        mockBackend.connections.subscribe(conn => {
          conn.mockRespond(new Response(new ResponseOptions({ body: JSON.stringify(mockResponse) })));
        });
        
        service.getLinks().then(links => {
          console.log(links);
          expect(links[0].id).toEqual(5722467590995968);
        });

      }))
    ));
  })
});
