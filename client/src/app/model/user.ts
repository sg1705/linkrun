export class User {
  id:         number;
  orgId:      number;
  fName:      string;
  lName:      string;
  picture:    string;
  email:      string;
  orgName:    string;
  orgAllowsPublic:boolean = false;

  constructor(id, orgId, firstName, lastName, photoUrl, email, orgName, orgAllowsPublic) {
    this.id = id;
    this.orgId = orgId;
    this.fName = firstName;
    this.lName = lastName;
    this.picture = photoUrl;
    this.email = email;
    this.orgName = orgName;
    this.orgAllowsPublic = orgAllowsPublic;
  }
  
}