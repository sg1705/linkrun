
'use strict';

const Datastore = require('@google-cloud/datastore');
const config = require('config');

// [START config]
const ds = Datastore({
  projectId: config.get('db.GCLOUD_PROJECT')
});
let kind = 'User';
// [END config]

// Translates from Datastore's entity format to
// the format expected by the application.
//
// Datastore format:
//   {
//     key: [kind, id],
//     data: {
//       property: value
//     }
//   }
//
// Application format:
//   {
//     id: id,
//     property: value
//   }

function setKind (kind_Name) {
  kind = kind_Name;
}

// function fromDatastore (obj) {
//   console.log('obj',obj)
//   obj.data.id = obj.key.id;
//   return obj.data;
// }

// Translates from the application's format to the datastore's
// extended entity property format. It also handles marking any
// specified properties as non-indexed. Does not translate the key.
//
// Application format:
//   {
//     id: id,
//     property: value,
//     unindexedProperty: value
//   }
//
// Datastore extended format:
//   [
//     {
//       name: property,
//       value: value
//     },
//     {
//       name: unindexedProperty,
//       value: value,
//       excludeFromIndexes: true
//     }
//   ]
function toDatastore (obj, nonIndexed) {
  nonIndexed = nonIndexed || [];
  const results = [];
  Object.keys(obj).forEach((k) => {
    if (obj[k] === undefined) {
      return;
    }
    results.push({
      name: k,
      value: obj[k],
      excludeFromIndexes: nonIndexed.indexOf(k) !== -1
    });
  });
  return results;
}

// Lists all links in the Datastore sorted alphabetically by title.
// The ``limit`` argument determines the maximum amount of results to
// return per page. The ``token`` argument allows requesting additional
// pages. The callback is invoked with ``(err, links, nextPageToken)``.
// [START list]
function list (limit, token, orgId, cb) {
  const q = ds.createQuery([kind])
    .filter("orgId", "=", orgId)
    .limit(limit)
    //.order('gourl') need to create composite index in order to use gourl with orgId
    .start(token);

  ds.runQuery(q, (err, entities, nextQuery) => {
    if (err) {
      cb(err);
      return;
    }
    const hasMore = nextQuery.moreResults !== Datastore.NO_MORE_RESULTS ? nextQuery.endCursor : false;
    cb(null, entities, hasMore);
    // cb(null, entities.map(fromDatastore), hasMore);
    
  });
}
// [END list]

// Creates a new link or updates an existing link with new data. The provided
// data is automatically translated into Datastore format. The link will be
// queued for background processing.
// [START update]
function update (id, data, cb) {
  let key;
  if (id) {
    key = ds.key([kind, parseInt(id, 10)]);
  } else {
    key = ds.key(kind);
  }

  const entity = {
    key: key,
    data: toDatastore(data, ['picture'])
  };

  ds.save(
    entity,
    (err) => {
      data.id = entity.key.id;
      cb(err, err ? null : data);
    }
  );
}
// [END update]

function create (data, cb) {
   getLinkId(data.orgId, data.gourl, (err, entities) => {
    if (err) {
      cb(err);
      return;
    }
    if(entities.length > 0) {
        console.log("link_already_exist; overwriting_link:" + entities[0].id);
        update(entities[0].id, data, cb);
     } else {
        update(null, data, cb);
     }
    });
}

function read (id, cb) {
  const key = ds.key([kind, parseInt(id, 10)]);
  ds.get(key, (err, entity) => {
    if (err) {
      cb(err);
      return;
    }
    if (!entity) {
      cb({
        code: 404,
        message: 'Not found'
      });
      return;
    }
    cb(null, entity);
  });
}

function readByColumn (columnName, columnValue, cb) {
  const q = ds.createQuery([kind])
  .filter(columnName, '=', columnValue);
  ds.runQuery(q, (err, entities, nextQuery) => {
    if (err) {
      cb(err);
      return;
    }
    const hasMore = nextQuery.moreResults !== Datastore.NO_MORE_RESULTS ? nextQuery.endCursor : false;
    cb(null, entities, hasMore);
  });
}

function getLinkId (orgId, gourl, cb) {
  const q = ds.createQuery([kind])
  .filter('orgId', '=', orgId)
  .filter('gourl', '=', gourl);
  ds.runQuery(q, (err, entities, nextQuery) => {
    if (err) {
      cb(err);
      return;
    }
    cb(null, entities);
  });
}


function _delete (id, cb) {
  const key = ds.key([kind, parseInt(id, 10)]);
  ds.delete(key, cb);
}

// [START exports]
module.exports = {
  setKind,
  create,
  read,
  update,
  delete: _delete,
  list
};
// [END exports]
