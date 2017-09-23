import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Link } from '../model/link';

@Injectable()
export class LinkService {
  private apiUrl: string = '/__/api/linksv2';

  constructor(private http: Http) { }

  /**
   * Return all links for the user
   */
  getLinks(shortName: string): Promise<Array<Link>> {
      return this.http.get(this.apiUrl+'/sort/'+shortName)
        .toPromise().then(res => {
          var data = res.json();
          var links = new Array<Link>();
          for (var entity of data) {
            var link = new Link(entity['id'], entity['gourl'], entity['url'], entity['description']);
            link.setUserId(entity['userId']);
            links.push(link);
          }
          return links;
        });
  }

  /**
   * Create link
   */
  createLink(link:Link): Promise<Link> {
    return this.http.post(this.apiUrl+'/create', {
      'link': link.link,
      'url': link.url,
      'description': link.description
    }).toPromise().then(res => {
      let resBody = res.json();
      let linkObj = new Link(resBody['id'], resBody['gourl'], resBody['url'], resBody['description']);
      linkObj.setUserId(resBody['userId']);
      return linkObj;
    })
  }

  updateLink(link:Link): Promise<Link> {
    return this.http.post(this.apiUrl+'/update/' + link.id, {
      'id': link.id,
      'link': link.link,
      'url': link.url,
      'description': link.description
    }).toPromise().then(res => {
      let resBody = res.json();
      let linkObj = new Link(resBody['id'], resBody['gourl'], resBody['url'], resBody['description'] );
      linkObj.setUserId(resBody['userId']);
      return linkObj;
    })
  }

  deleteLink(linkId): Promise<boolean> {
    return this.http.post(this.apiUrl+'/delete/' + linkId, {'id': linkId,})
    .toPromise()
    .then(res => {
      let resBody = res.json();
      return resBody['done'];
    })
  }

  getLink(linkId): Promise<Link> {
      return this.http.get(this.apiUrl + '/link/'+linkId)
        .toPromise().then(res => {
          var entity = res.json();
          var link = new Link(entity['id'], entity['gourl'], entity['url'], entity['description']);
          link.setUserId(entity['userId']);
          return link;
        })
  }

  isLinkExists(linkName): Promise<boolean> {
      return this.http.get(this.apiUrl + '/linkName/'+linkName)
        .toPromise().then(res => {
          var entities = res.json();
          if (entities['entities'].length > 0) {
            return true;
          }
          return false;
        })
  }



}

