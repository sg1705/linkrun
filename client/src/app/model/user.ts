export class User {
  id:         Number;
  orgId:      Number;
  firstName:  String;
  lastName:   String;
  photoUrl:   String;
  email:      String;

  construction(id, orgId, firstName, lastName, photoUrl, email) {
    this.id = id;
    this.orgId = orgId;
    this.firstName = firstName;
    this.lastName = lastName;
    this.photoUrl = photoUrl;
    this.email = email;
  }
  
}