const couchbase =  require('couchbase');

const cluster = new couchbase.Cluster(`couchbase://${process.env.COUCHBASE_URL}`, {
   username: process.env.COUCHBASE_USERNAME,
   password: process.env.COUCHBASE_PASSWORD,
});
var bucket = cluster.bucket('slot-game');
var coll = bucket.defaultCollection();
console.log(coll);
// module.exports.getObject = (key, callback) => {
//    bucket.get(key, (error, result) => {
//      if (error) {
//        console.log(key, error, 'bucket get error');
//      }
//      callback(error, result);
//    });
// };

module.exports.couchbaseCollection = coll;
// export const couchbaseCollection = collection;