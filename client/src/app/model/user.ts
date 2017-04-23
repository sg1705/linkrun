export class User {
  id:         number;
  orgId:      number;
  fName:      string;
  lName:   string;
  picture:   string;
  email:      string;

  constructor(id, orgId, firstName, lastName, photoUrl, email) {
    this.id = id;
    this.orgId = orgId;
    this.fName = firstName;
    this.lName = lastName;
    this.picture = photoUrl;
    this.email = email;
  }
  
}