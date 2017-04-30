
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
 * GET /api/links
 *
 * Retrieves all links for the user
 */
router.get('/', (req, res, next) => {
  //get user from cookie
  var userId = cookieService.getXsession(req).userId;
  var orgId = cookieService.getXsession(req).orgId;
  console.log(orgId);
  linkService.getLinksByUser(userId).then(links => {
    console.log('returned links', links);
    res.json(links['entities']);
  }).catch(err => {
      console.log(err);
      return;    
  })
});

router.post('/create', (req, res, next) => {
  console.log(req.body);
  res.json(req.body);
});



module.exports = router;
