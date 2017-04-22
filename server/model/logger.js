
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

 debug (msg) {
    let entry = this.log.entry(this.metadata, { "msg": msg});
    this.log.debug (entry);
 }
  
 debug (msg, detailMessage) {
    let entry = this.log.entry(this.metadata, { "msg": msg, "detail": detailMessage});
    this.log.debug (entry);
 }
 
 info (msg) {
    let entry = this.log.entry(this.metadata, { "msg": msg});
    this.log.info(entry);
 }

 info (msg, detailMessage) {
    let entry = this.log.entry(this.metadata, { "msg": msg, "detail": detailMessage});
    this.log.info(entry);
 }

 error (msg) {
    let entry = this.log.entry(this.metadata, { "msg": msg});
    this.log.error (entry);
 }

 error (msg, detailMessage) {
    let entry = this.log.entry(this.metadata, { "msg": msg, "detail": detailMessage});
    this.log.error (entry);
 }
}
module.exports = Logger;