
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
const LinkService = require(`../model/link.js`);
const WS = require(`../model/word-similarity.js`);
const cookieService = require('../cookie.js');
const Datastore = require('@google-cloud/datastore');
var   logger       = require('../model/logger.js');

const linkService = new LinkService();
const router = express.Router();
const ws = new WS();


// Automatically parse request body as JSON
router.use(bodyParser.json());

/**
 * Retrieves all links for the user and sort them based on the similarity to the input word
 */
var getLinks = (req, res, next)=> {
  //get user from cookie
  var userId = cookieService.getXsession(req).userId;
  var orgId = cookieService.getXsession(req).orgId;
  //get link id
  var linkName = req.params['name'];  

  linkService.getLinksByOrgId(orgId).then(links => {
    if (linkName)
      res.json(ws.sort(links['entities'], linkName));
    else 
      res.json(links['entities'])
  }).catch(err => {
      logger.error(err);
      return;    
  })
};

router.get('/', getLinks);

router.get('/sort', getLinks);

router.get('/sort/:name', getLinks);


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

router.post('/delete/:id', (req, res, next) => {
  //get user from cookie
  var userId = cookieService.getXsession(req).userId;
  var orgId = cookieService.getXsession(req).orgId;
  var linkId = req.params['id'];
  linkService.deleteLink(userId, orgId, linkId).then(done => {
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
