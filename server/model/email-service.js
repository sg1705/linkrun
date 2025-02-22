'use strict';

const sgMail = require('@sendgrid/mail')
const config = require('config');
const Org = require('./org')
const logger   = require('./logger.js');
var GA = require('./google-analytics-tracking.js')
let ga = new GA();
let org = new Org();
sgMail.setApiKey(config.get("email.SENDGRID_API_KEY"));
const WRAPPER = '%';

class EmailService {


    /**
     * Send referral email
     * 
     */

    sendEmail(email, emailType, fName, orgName, userId, orgId) {
        return new Promise((resolve, reject) => {
            let companyName = 'your company';
            if (orgName && !orgName.includes('@gmail.com')) companyName = orgName;
            let GA_TRACKING_ID = config.get('ga.GA_TRACKING_ID');
            const msg = {
                to: email,
                from: 'info@link.run',
                subject: 'Welcome, ' + fName +'!',
                substitutionWrappers: [WRAPPER, WRAPPER ],
                substitutions: {
                    "name": fName,
                    "orgName": companyName,
                    "gaTrackingId" : GA_TRACKING_ID,
                    "userId" : userId
                },
                template_id: config.get("email.template_id." + emailType)
            };
            logger.info('sending email: ', {'userId':userId, 'orgId':orgId, 'msg':msg});
            sgMail.send(msg).then((result)=>{
                logger.info('email sent:', {'userId':userId, 'orgId':orgId, 'msg':msg});
                ga.trackEvent(userId, orgId, 'User', 'email send', 'success', '100');
                resolve();

            }).catch(err => {
                logger.error('email send error:' + err);
                reject(err);
            });
        })

    }
}

// [START exports]
module.exports = EmailService;
// [END exports]
