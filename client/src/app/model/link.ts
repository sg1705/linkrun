export class Link {
  id:           number;
  link:         string;
  url:          string;
  description:  string;
  userId:       number;
  acl:          number = 0;

  static readonly LINK_ACL_DEFAULT = 0;
  static readonly LINK_ACL_PUBLIC  = 1;
  static readonly LINK_ACL_PRIVATE = 2;
 
  constructor(id, link, url, description, acl) {
    this.id = id;
    this.url = url;
    this.link = link;
    this.description = description;
    this.acl = acl;
  }

  setUserId(userId: number) {
    this.userId = userId;
  }
  
}