export class Link {
  id:           number;
  link:         string;
  url:          string;
  userId:       number;
  isExposedAsPublicLink:     boolean;
  
  constructor(id, link, url, isPublic) {
    this.id = id;
    this.url = url;
    this.link = link;
    this.isExposedAsPublicLink = isPublic;
  }

  setUserId(userId: number) {
    this.userId = userId;
  }
  
}