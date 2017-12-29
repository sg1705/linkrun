
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const LinkService = require(`../model/link.js`);
const UserService = require(`../model/user.js`);
const cookieService = require('../cookie.js');
const Datastore = require('@google-cloud/datastore');
var   logger       = require('../model/logger.js');
const _ = require('lodash');

const linkService = new LinkService();
const userService = new UserService();
const router = express.Router();
const json2csv = require('json2csv');

/**
 * Mapping in datastore to API request received from app
 * 
 * link:        gourl
 * url:         url
 * description: description
 * acl:         acl
 */

// Automatically parse request body as JSON
router.use(bodyParser.json());

/**
 * Retrieves all links for the user
 */
router.get('/', (req, res, next) => {
  //get user from cookie
  var userId = cookieService.getXsession(req).userId;
  var orgId = cookieService.getXsession(req).orgId;
  linkService.getLinksByOrgId(orgId).then(links => {
    res.json(links['entities']);
  }).catch(err => {
      logger.error(err);
      return;    
  })
});

/**
 * Retrieves all links for the user
 */
router.get('/csv', (req, res, next) => {
  //get user from cookie
  var userId = cookieService.getXsession(req).userId;
  var orgId = cookieService.getXsession(req).orgId;

  userService.getAllUsers(orgId).then(users => {
    linkService.getLinksByOrgId(orgId).then(links => {
      links['entities'].forEach(link => {
        var user = _.find(users, function(user) {
            return (user.id == link.userId);
        })
        if (user != null) {
          link['userName'] = user.fName + ' ' + user.lName;
        } else {
          link['userName'] = '';
        }
      });
      var fields = ['gourl', 'url','description', 'updatedAt', 'userName'];
      var fieldNames = ['Short Link', 'URL', 'Description', 'Updated Date', 'Created By'];
      var result = json2csv({ data: links['entities'], fields: fields, fieldNames: fieldNames });
      res.set('Content-Type', 'application/octet-stream');
      res.send(result);
    }).catch(err => {
        logger.error(err);
        return;    
    })
  }).catch(err => {
    logger.error('error exporting to csv',err);
    return;
  })
});


router.post('/create', (req, res, next) => {
  //get user from cookie
  var userId = cookieService.getXsession(req).userId;
  var orgId = cookieService.getXsession(req).orgId;
  var link = req.body['link'];
  var url = req.body['url'];
  var desc = req.body['description'] || '';
  var acl = req.body['acl'] || 0;  
  linkService.createLink(orgId, userId, cookieService.getGAClientId(req), link, url, desc, acl).then(entity => {
    res.json(entity);
  })  
});

router.post('/update/:id', (req, res, next) => {
  //get user from cookie
  var userId = cookieService.getXsession(req).userId;
  var orgId = cookieService.getXsession(req).orgId;
  var linkId = req.params['id'];
  var link = req.body['link'];
  var url = req.body['url'];
  var desc = req.body['description'] || '';
  var acl = req.body['acl'] || 0;
  linkService.updateLink(linkId, orgId, userId, cookieService.getGAClientId(req), link, url, desc, acl).then(entity => {
    res.json(entity);
  })  
});

router.post('/delete/:id', (req, res, next) => {
  //get user from cookie
  var userId = cookieService.getXsession(req).userId;
  var orgId = cookieService.getXsession(req).orgId;
  var linkId = req.params['id'];
  linkService.deleteLink(userId, orgId, cookieService.getGAClientId(req), linkId).then(done => {
    res.json({done: true});
  })  
});




/**
 * Retrieves a link for the given linkid
 */
router.get('/link/:id', (req, res, next) => {
  //get user from cookie
  var userId = cookieService.getXsession(req).userId;
  var orgId = cookieService.getXsession(req).orgId;
  //get link id
  var linkId = req.params['id'];
  linkService.getLink(linkId).then(link => {
    res.json(link);
  }).catch(err => {
      logger.error(err);
      return;    
  })
});


/**
 * Retrieves a link for the given link name
 */
router.get('/linkName/:name', (req, res, next) => {
  //get user from cookie
  var userId = cookieService.getXsession(req).userId;
  var orgId = cookieService.getXsession(req).orgId;
  //get link id
  var linkName = req.params['name'];
  linkService.getLinkByGoLink(linkName, orgId).then(entities => {
    res.json(entities);
  }).catch(err => {
      logger.error(err);
      return;    
  })
});




module.exports = router;
