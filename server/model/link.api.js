
// 'use strict';

// const express = require('express');
// const bodyParser = require('body-parser');
// const config = require('config');

// function getModel () {
//   return require(`./model-${config.get('db.DATA_BACKEND')}`);
// }
// getModel().setKind("Link");
// const router = express.Router();

// // Automatically parse request body as JSON
// router.use(bodyParser.json());

// /**
//  * GET /api/links
//  *
//  * Retrieve a page of links (up to ten at a time).
//  */
// router.get('/', (req, res, next) => {
//   getModel().list(10, req.query.pageToken, 'orgId', (err, entities, cursor) => {
//     if (err) {
//       next(err);
//       return;
//     }
//     res.json({
//       items: entities,
//       nextPageToken: cursor
//     });
//   });
// });

// /**
//  * POST /api/links
//  *
//  * Create a new link.
//  */
// router.post('/', (req, res, next) => {
//   getModel().create(req.body, (err, entity) => {
//     if (err) {
//       next(err);
//       return;
//     }
//     res.json(entity);
//   });
// });

// /**
//  * GET /api/links/:id
//  *
//  * Retrieve a link.
//  */
// router.get('/:link', (req, res, next) => {
//   getModel().read(req.params.link, (err, entity) => {
//     if (err) {
//       next(err);
//       return;
//     }
//     res.json(entity);
//   });
// });

// /**
//  * PUT /api/links/:id
//  *
//  * Update a link.
//  */
// router.put('/:link', (req, res, next) => {
//   getModel().update(req.params.link, req.body, (err, entity) => {
//     if (err) {
//       next(err);
//       return;
//     }
//     res.json(entity);
//   });
// });

// /**
//  * DELETE /api/links/:id
//  *
//  * Delete a link.
//  */
// router.delete('/:link', (req, res, next) => {
//   getModel().delete(req.params.link, (err) => {
//     if (err) {
//       next(err);
//       return;
//     }
//     res.status(200).send('OK');
//   });
// });

// /**
//  * Errors on "/api/links/*" routes.
//  */
// router.use((err, req, res, next) => {
//   // Format error and forward to generic error handler for logging and
//   // responding to the request
//   err.response = {
//     message: err.message,
//     internalCode: err.code
//   };
//   next(err);
// });

// module.exports = router;
