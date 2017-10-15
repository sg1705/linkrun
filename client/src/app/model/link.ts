export class Link {
  id:           number;
  link:         string;
  url:          string;
  userId:       number;
<<<<<<< HEAD
  isExposedAsPublicLink:     boolean;
  
  constructor(id, link, url, isPublic) {
    this.id = id;
    this.url = url;
    this.link = link;
    this.isExposedAsPublicLink = isPublic;
=======
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
>>>>>>> origin/master
  }

  setUserId(userId: number) {
    this.userId = userId;
  }
  
}