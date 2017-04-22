
'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');
var Logger = require('./logger.js');
let logger = new Logger();

function getModel () {
  return require(`./model-${config.get('db.DATA_BACKEND')}`);
}

getModel().setKind("Link");
const router = express.Router();

// Automatically parse request body as form data
router.use(bodyParser.urlencoded({ extended: false }));

// Set Content-Type for all responses for these routes
router.use((req, res, next) => {
  res.set('Content-Type', 'text/html');
  next();
});

/**
 * GET /links/add
 *
 * Display a page of links (up to ten at a time).
 */
router.get('/', (req, res, next) => {
  var xsession = req.signedCookies[config.get("COOKIE_NAME")];
  if (xsession == null) {
    logger.info('link is not saved as xsession stored in cookie is NULL'); 
    res.redirect(`/login`);
  }
  getModel().list(10, req.query.pageToken, xsession.orgId, (err, entities, cursor) => {
    if (err) {
      next(err);
      return;
    }
    res.render('links/list.jade', {
      links: entities,
      nextPageToken: cursor
    });
  });
});

/**
 * GET /links/add
 *
 * Display a form for creating a link.
 */
// [START add_get]
router.get('/add', (req, res) => {
  res.render('links/form.jade', {
    link: {},
    action: 'Add'
  });
});
// [END add_get]

/**
 * POST /links/add
 *
 * Create a link.
 */
// [START add_post]
router.post('/add', (req, res, next) => {
  let data = req.body;
  var xsession = req.signedCookies[config.get("COOKIE_NAME")];
  if (xsession == null) {
    logger.info('link is not saved as xsession stored in cookie is NULL'); 
    res.redirect(`/login`);
  }
  data['userId'] = xsession.userId;
  data['orgId'] = xsession.orgId;
  logger.info("add_link", data); 
  // Save the data to the database.
  getModel().create(data, (err, savedData) => {
    if (err) {
      next(err);
      return;
    }
    res.redirect(`${req.baseUrl}/${savedData.id}`);
  });
});
// [END add_post]

/**
 * GET /links/:id/edit
 *
 * Display a link for editing.
 */
router.get('/:link/edit', (req, res, next) => {
  getModel().read(req.params.link, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.render('links/form.jade', {
      link: entity,
      action: 'Edit'
    });
  });
});

/**
 * POST /links/:id/edit
 *
 * Update a link.
 */
router.post('/:link/edit', (req, res, next) => {
  let data = req.body;
  var xsession = req.signedCookies[config.get("COOKIE_NAME")];
  if (xsession == null) {
    logger.info('link is not saved as xsession stored in cookie is NULL'); 
    res.redirect(`/login`);
  }
  data['userId'] = xsession.userId;
  data['orgId'] = xsession.orgId;
  logger.info("edit_link=", data); 
  getModel().update(req.params.link, data, (err, savedData) => {
    if (err) {
      logger.error('error_edit_link',err); 
      next(err);
      return;
    }
    res.redirect(`${req.baseUrl}/${savedData.id}`);
  });
});

/**
 * GET /links/:id
 *
 * Display a link.
 */
router.get('/:link', (req, res, next) => {
  getModel().read(req.params.link, (err, entity) => {
    if (err) {
     logger.error('error_get_link',err); 
      next(err);
      return;
    }
    logger.debug("view_link", entity); 
    res.render('links/view.jade', {
      link: entity
    });
  });
});

/**
 * GET /links/:id/delete
 *
 * Delete a link.
 */
router.get('/:link/delete', (req, res, next) => {
  getModel().delete(req.params.link, (err) => {
    if (err) {
      logger.error('error_delete_link',err); 
      next(err);
      return;
    }
    logger.debug("delete_link", req.params); 
    res.redirect(req.baseUrl);
  });
});

/**
 * Errors on "/links/*" routes.
 */
router.use((err, req, res, next) => {
  // Format error and forward to generic error handler for logging and
  // responding to the request
  err.response = err.message;
  next(err);
});

module.exports = router;
