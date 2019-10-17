import { Injectable } from "@angular/core";
import { HttpClient, HttpResponse } from "@angular/common/http";

import { Link } from "../model/link";

@Injectable({
  providedIn: "root"
})
export class LinkService {
  private apiUrl: string = "/__/api/linksv2";

  constructor(private http: HttpClient) {}

  getLink(linkId: number): Promise<Link> {
    return this.http
      .get(this.apiUrl + "/link/" + linkId)
      .toPromise()
      .then(res => {
        var entity = res;
        var link = new Link(
          entity["id"],
          entity["gourl"],
          entity["url"],
          entity["description"],
          entity["acl"]
        );
        link.setUserId(entity["userId"]);
        return link;
      });
  }

  /**
   * Return all links for the user
   */
  getLinks(): Promise<Array<Link>> {
    return this.http
      .get<Object[]>(this.apiUrl)
      .toPromise()
      .then(res => {
        var data = res;
        var links = new Array<Link>();
        for (var entity of data) {
          var link = new Link(
            entity["id"],
            entity["gourl"],
            entity["url"],
            entity["description"],
            entity["acl"]
          );
          link.setUserId(entity["userId"]);
          links.push(link);
        }
        return links;
      });
  }

  /**
   * Create link
   */
  createLink(link: Link): Promise<Link> {
    return this.http
      .post(this.apiUrl + "/create", {
        link: link.link,
        url: link.url,
        description: link.description,
        acl: link.acl
      })
      .toPromise()
      .then(res => {
        let resBody = res;
        let linkObj = new Link(
          resBody["id"],
          resBody["gourl"],
          resBody["url"],
          resBody["description"],
          resBody["acl"]
        );
        linkObj.setUserId(resBody["userId"]);
        return linkObj;
      });
  }

  isLinkExists(linkName): Promise<boolean> {
    return this.http
      .get<Object[]>(this.apiUrl + "/linkName/" + linkName)
      .toPromise()
      .then(res => {
        var entities = res;
        if (entities["entities"].length > 0) {
          return true;
        }
        return false;
      });
  }

  deleteLink(linkId): Promise<boolean> {
    return this.http
      .post(this.apiUrl + "/delete/" + linkId, { id: linkId })
      .toPromise()
      .then(res => {
        let resBody = res;
        return resBody["done"];
      });
  }

  async updateLink(link: Link): Promise<Link> {
    let res = await this.http
      .post(this.apiUrl + "/update/" + link.id, {
        id: link.id,
        link: link.link,
        url: link.url,
        description: link.description,
        acl: link.acl
      })
      .toPromise();
    let resBody = res;
    let linkObj = new Link(
      resBody["id"],
      resBody["gourl"],
      resBody["url"],
      resBody["description"],
      resBody["acl"]
    );
    linkObj.setUserId(resBody["userId"]);
    return linkObj;
  }
}
