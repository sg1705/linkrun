import { Injectable } from "@angular/core";
import { User } from "../model/user";

@Injectable({
  providedIn: "root"
})
export class HelperService {
  constructor() {}

  public generateFullShortLink(link: string) {
    return "https://link.run/" + link;
  }

  public generatePublicLink(link: string, user: User) {
    if (user.orgAllowsPublic) {
      return "https://link.run/@" + user.orgShortName + "/" + link;
    }
    return null;
  }

  public generatePublicLinkFromOrgShortName(
    link: string,
    orgShortName: string
  ) {
    return "https://link.run/@" + orgShortName + "/" + link;
  }
}
