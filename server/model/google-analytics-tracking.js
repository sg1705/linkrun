'use strict';
var config = require('config');
const request = require('request');
const express = require('express');
const app = express();
app.enable('trust proxy');

class GA {

    trackEvent(userId, orgId, category, action, label, value, cb) {
        let GA_TRACKING_ID = config.get('ga.GA_TRACKING_ID');
        const data = {
            // API Version.
            v: '1',
            // Tracking ID / Property ID.
            tid: GA_TRACKING_ID,
            // Anonymous Client Identifier. Ideally, this should be a UUID that
            // is associated with particular user, device, or browser instance.
            cid: userId,
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
