
// Imports the Google Cloud client library
const Logging = require('@google-cloud/logging');
var config    = require('config');

// Instantiates a client
const loggingClient = Logging({
  projectId: config.get('db.GCLOUD_PROJECT')
});

class Logger {

 constructor() {
    // Selects the log to write to
    this.log = loggingClient.log('link.run');
    // The metadata associated with the entry
    this.metadata = { resource: { type: 'global' } };
 }

 logOnConsole(msg, detail) {
   if (!process.env.NODE_ENV) {
      if(!detail){
        console.log(msg);
      } else 
        console.log(msg, detail);
      return true;
  }
 }

 debug (msg) {
    if (this.logOnConsole(msg)) return;
    let entry = this.log.entry(this.metadata, { "msg": msg});
    this.log.debug (entry);
 }
  
 debug (msg, detail) {
    if (this.logOnConsole(msg, detail)) return;
    let entry = this.log.entry(this.metadata, { "msg": msg, "detail": detail});
    this.log.debug (entry);
 }
 
 info (msg) {
    if (this.logOnConsole(msg)) return;
    let entry = this.log.entry(this.metadata, { "msg": msg});
    this.log.info(entry);
 }

 info (msg, detail) {
    if (this.logOnConsole(msg, detail)) return;
    let entry = this.log.entry(this.metadata, { "msg": msg, "detail": detail});
    this.log.info(entry);
 }

 error (msg) {
    if (this.logOnConsole(msg)) return;
    let entry = this.log.entry(this.metadata, { "msg": msg});
    this.log.error (entry);
 }

 error (msg, detail) {
    if (this.logOnConsole(msg, detail)) return;
    let entry = this.log.entry(this.metadata, { "msg": msg, "detail": detail});
    this.log.error (entry);
 }
}
module.exports = Logger;