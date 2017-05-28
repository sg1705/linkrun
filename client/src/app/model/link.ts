export class Link {
  id:           number;
  link:         string;
  url:          string;
  description:  string;
  userId:       number;
  
  constructor(id, link, url, description) {
    this.id = id;
    this.url = url;
    this.link = link;
    this.description = description;
  }

  setUserId(userId: number) {
    this.userId = userId;
  }
  
}