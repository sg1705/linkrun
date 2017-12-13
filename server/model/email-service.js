'use strict';
const sgMail = require('@sendgrid/mail')
const config = require('config');
const Org = require('./org')
const logger   = require('./logger.js');

let org = new Org();
sgMail.setApiKey(config.get("email.SENDGRID_API_KEY"));
const WRAPPER = '%';

class EmailService {


    /**
     * Send referral email
     * 
     */

    sendReferralEmail(email, fName, orgName) {
        if (process.env.NODE_ENV == 'production') return; //skip email for production for now
        let companyName = 'your company';
        if (orgName && !orgName.includes('@gmail.com')) companyName = orgName;
        const msg = {
            to: email,
            from: 'info@link.run',
            subject: 'welcome, ' + fName,
            substitutionWrappers: [WRAPPER, WRAPPER ],
            substitutions: {
                "name": fName,
                "orgName": companyName
            },
            template_id: config.get("email.referral_welcome_template_id")
        };
        logger.info('sending message: ')
        logger.info(msg)
        sgMail.send(msg);

    }
}

// [START exports]
module.exports = EmailService;
// [END exports]
