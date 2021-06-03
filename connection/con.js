const couchbase = require('couchbase');

const cluster = new couchbase.Cluster("couchbase://localhost", {
   username: 'hardik',
   password: 'Hardik@123',
});
var bucket = cluster.bucket('slot-game');
var coll = bucket.defaultCollection();

const getObject = (key) => {
   return new Promise((resolve, reject) => {
      coll.get(key, (err, res) => {
         if (err) {
            return reject(err);
         } else {
            return resolve(res);
         }
      });
   });
}

module.exports = {
   couchbaseCollection: coll,
   getObject
};
// export const couchbaseCollection = collection;