
'use strict';

const Datastore = require('@google-cloud/datastore');
const config = require('config');

// [START config]
class ModelService {

    constructor(kind) {
        this.ds = Datastore({
            projectId: config.get('db.GCLOUD_PROJECT')
        });
        this.kind = kind;

    }
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

    setKind(kind_Name) {
        this.kind = kind_Name;
    }

    // fromDatastore(obj) {
    //     obj.data.id = obj.key.id;
    //     return obj.data;
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
    toDatastore(obj, nonIndexed) {
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
    list(limit, token) {
        let ds = this.ds;
        let kind = this.kind;
        return new Promise((resolve, reject) => {
            const q = ds.createQuery([kind])
                .limit(limit)
                .order('gourl')
                .start(token);

            ds.runQuery(q, (err, entities, nextQuery) => {
                if (err) {
                    reject(err);
                }
                const hasMore = nextQuery.moreResults !== Datastore.NO_MORE_RESULTS ? nextQuery.endCursor : false;
                resolve({
                    entities: entities,//.map(this.fromDatastore),
                    hasMore: hasMore
                })
            });
        })
    }
    // [END list]

    // Creates a new link or updates an existing link with new data. The provided
    // data is automatically translated into Datastore format. The link will be
    // queued for background processing.
    // [START update]
    update(id, data) {
        let ds = this.ds;
        let kind = this.kind;
        return new Promise((resolve, reject) => {
            let key;
            if (id) {
                key = ds.key([kind, parseInt(id, 10)]);
            } else {
                key = ds.key(kind);
            }
            const entity = {
                key: key,
                data: this.toDatastore(data, ['picture'])
            };

            ds.save(
                entity,
                (err) => {
                    data.id = entity.key.id;
                    if (err) {
                        reject(err);
                    } else {
                        resolve(data);
                    }
                    // cb(err, err ? null : data);
                }
            );
        })
    }
    // [END update]

    create(data) {
        let ds = this.ds;
        let kind = this.kind;
        return this.update(null, data);
    }

    read(id) {
        let ds = this.ds;
        let kind = this.kind;
        return new Promise((resolve, reject) => {
            const key = ds.key([kind, parseInt(id, 10)]);
            ds.get(key, (err, entity) => {
                if (err) {
                    reject(err);
                }
                if (!entity) {
                    resolve({
                        code: 404,
                        message: 'Not found'
                    });
                }
                resolve(entity);
            });
        })
    }

    readByColumn(columnName, columnValue) {
        let ds = this.ds;
        let kind = this.kind;
        return new Promise((resolve, reject) => {
            const q =
                ds.createQuery([kind])
                    .filter(columnName, '=', columnValue);
            ds.runQuery(q, (err, entities, nextQuery) => {
                if (err) {
                    reject(err);
                }
                const hasMore = nextQuery.moreResults !== Datastore.NO_MORE_RESULTS ? nextQuery.endCursor : false;
                resolve({
                    entities: entities,//.map(this.fromDatastore),
                    hasMore: hasMore
                })
            });

        });
    }

    readByColumns(c1, v1, c2, v2) {
        let ds = this.ds;
        let kind = this.kind;
        return new Promise((resolve, reject) => {
            const q =
                ds.createQuery([kind])
                    .filter(c1, '=', v1)
                    .filter(c2, '=', v2);
            ds.runQuery(q, (err, entities, nextQuery) => {
                if (err) {
                    reject(err);
                }
                const hasMore = nextQuery.moreResults !== Datastore.NO_MORE_RESULTS ? nextQuery.endCursor : false;
                resolve({
                    entities: entities,//.map(this.fromDatastore),
                    hasMore: hasMore
                })
            });

        });
    }

    getColumn(c, c2, v2) {
        let ds = this.ds;
        let kind = this.kind;
        const q = ds.createQuery([kind])
            // .filter(c2, "=", v2)
            .select([c])
        const shortNames = new Set();
console.log('get column', c, c2, v2)
        return ds.runQuery(q)
            .then((results) => {
                console.log('query ',results)
                const entries = results[0];
                entries.forEach((entry) => {
                    shortNames.add(entry[c]);

                })
console.log('shortNames', shortNames)
return shortNames;

                // return {
                //     shortNames: shortNames
                // }
            })
    }

    _delete(id, cb) {
        let ds = this.ds;
        let kind = this.kind;
        return new Promise((resolve, reject) => {
            const key = ds.key([kind, parseInt(id, 10)]);
            ds.delete(key, function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }
}

// [START exports]
module.exports = ModelService;
// [END exports]
