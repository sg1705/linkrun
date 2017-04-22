
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const config = require('config');

function getModel () {
  return require(`./model-${config.get('db.DATA_BACKEND')}`);
}

const router = express.Router();

// Automatically parse request body as JSON
router.use(bodyParser.json());

/**
 * POST /api/users
 *
 * Create a new user.
 */
router.post('/', (req, res, next) => {
  getModel().create(req.body, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.json(entity);
  });
});

/**
 * GET /api/users/:id
 *
 * Retrieve a user.
 */
router.get('/:user', (req, res, next) => {
  getModel().read(req.params.user, (err, entity) => {
    if (err) {
      console.log(err);
      next(err);
      return;
    }
    res.json(entity);
  });
});

/**
 * PUT /api/users/:id
 *
 * Update a user.
 */
router.put('/:user', (req, res, next) => {
  getModel().update(req.params.user, req.body, (err, entity) => {
    if (err) {
      next(err);
      return;
    }
    res.json(entity);
  });
});

/**
 * DELETE /api/users/:id
 *
 * Delete a user.
 */
router.delete('/:user', (req, res, next) => {
  getModel().delete(req.params.user, (err) => {
    if (err) {
      next(err);
      return;
    }
    res.status(200).send('OK');
  });
});

/**
 * Errors on "/api/users/*" routes.
 */
router.use((err, req, res, next) => {
  // Format error and forward to generic error handler for logging and
  // responding to the request
  err.response = {
    message: err.message,
    internalCode: err.code
  };
  next(err);
});

module.exports = router;
