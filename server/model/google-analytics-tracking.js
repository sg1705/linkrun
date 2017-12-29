'use strict';
var config = require('config');
const request = require('request');
var logger       = require('./logger.js');

class GA {
    trackEvent(userId, orgId, category, action, label, value, clientId, cb) {
        if (clientId == null) {
            clientId = "NOT_SET";
            category = category + "_WO_CID";
        }
        let GA_TRACKING_ID = config.get('ga.GA_TRACKING_ID');
        const data = {
            // API Version.
            v: '1',
            // Tracking ID / Property ID.
            tid: GA_TRACKING_ID,
            // Anonymous Client Identifier. Ideally, this should be a UUID that
            // is associated with particular user, device, or browser instance.
            cid: clientId,
            uid: userId,
            cd1: orgId, // org-id custom dimenstion

            // client-id custom dimension. Custom dimension is easier to use and 
            // has less restricitons than the built-in cid.
            cd2: userId,

            // user-id custom dimension
            cd3: userId,

            // Event hit type.
            t: 'event',
            // Event category.
            ec: category,
            // Event action.
            ea: action,
            // Event label.
            el: label,
            // Event value.
            ev: value,
            //custom dimension 
        };
        this.postEvent(userId, orgId, data, cb);
    }

    trackPageView(userId, orgId, pageName, clientId, cb) {
        let GA_TRACKING_ID = config.get('ga.GA_TRACKING_ID');
        if (clientId == null) {
            clientId = "NOT_SET"
        }
        const data = {
            // API Version.
            v: '1',
            // Tracking ID / Property ID.
            tid: GA_TRACKING_ID,
            // Anonymous Client Identifier. Ideally, this should be a UUID that
            // is associated with particular user, device, or browser instance.
            cid: clientId,
            uid: userId,
            cd1: orgId, // org-id custom dimenstion

            // client-id custom dimension. Custom dimension is easier to use and 
            // has less restricitons than the built-in cid.
            cd2: userId,

            // user-id custom dimension
            cd3: userId,

            // Event hit type.
            t: 'pageView',
            
            dp: pageName
 
        };
        this.postEvent(userId, orgId, data, cb);
    }


    postEvent(userId, orgId, data, cb) {
        request.post(
            'http://www.google-analytics.com/collect',
            {
                form: data
            },
            (err, response) => {
                if (err) {
                    logger.info('error: ', err)
                    return;
                }
                if (response.statusCode !== 200) {
                    logger.info('Tracking failed')
                    return;
                }
            }
        );
    }
}

module.exports = GA;