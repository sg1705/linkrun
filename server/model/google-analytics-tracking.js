'use strict';
const got = require('got');
var config = require('config');

class GA {

    trackEvent(client, category, action, label, value, cb) {
        let GA_TRACKING_ID = config.get('ga.GA_TRACKING_ID');
        const data = {
            // API Version.
            v: '1',
            // Tracking ID / Property ID.
            tid: GA_TRACKING_ID,
            // Anonymous Client Identifier. Ideally, this should be a UUID that
            // is associated with particular user, device, or browser instance.
            // cid: client,
            uid: client,

            // Event hit type.
            t: 'event',
            // Event category.
            ec: category,
            // Event action.
            ea: action,
            // Event label.
            el: label,
            // Event value.
            ev: value
        };

        return got.post('http://www.google-analytics.com/collect', {
            body: data
        });
    }
}

module.exports = GA;
