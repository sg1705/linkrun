
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const LinkService = require(`../model/link.js`);
const cookieService = require('../cookie.js');
const Datastore = require('@google-cloud/datastore');

const linkService = new LinkService();
const router = express.Router();

// Automatically parse request body as JSON
router.use(bodyParser.json());

/**
 * Retrieves all links for the user
 */
router.get('/', (req, res, next) => {
  //get user from cookie
  var userId = cookieService.getXsession(req).userId;
  var orgId = cookieService.getXsession(req).orgId;
  linkService.getLinksByUser(userId).then(links => {
    res.json(links['entities']);
  }).catch(err => {
      logger.error(err);
      return;    
  })
});

router.post('/create', (req, res, next) => {
  //get user from cookie
  var userId = cookieService.getXsession(req).userId;
  var orgId = cookieService.getXsession(req).orgId;
  var link = req.body['link'];
  var url = req.body['url'];
  var desc = req.body['description'];
  var newLink = {
    userId: userId,
    orgId:  orgId,
    link:   link,
    url:    url,
    description: desc
  }
  linkService.createLink(orgId, userId, link, url, desc).then(entity => {
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
  var desc = req.body['description'];
  linkService.updateLink(linkId, orgId, userId, link, url, desc).then(entity => {
    res.json(entity);
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




module.exports = router;
