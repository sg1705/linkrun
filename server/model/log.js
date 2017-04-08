

class Logger {

 log(orgId, userId, gourl, msgtype, msg) {
    let logMsg ={}    
    logMsg["orgId"] = orgId;
    logMsg["userId"] = userId;
    logMsg["gourl"] = gourl;
    logMsg["msgtype"] = msgtype;
    logMsg["msg"] = msg; 
    console.log(logMsg);
 }
}
module.exports = Logger;