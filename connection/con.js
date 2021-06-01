const couchbase =  require('couchbase');

const cluster = new couchbase.Cluster("couchbase://localhost", {
   username: 'hardik',
   password: 'Hardik@123',
});
var bucket = cluster.bucket('slot-game');
var coll = bucket.defaultCollection();
console.log(coll);
module.exports.getObject = (key, callback) => {
   bucket.get(key, (error, result) => {
     if (error) {
       console.log(key, error, 'bucket get error');
     }
     callback(error, result);
   });
};

module.exports.couchbaseCollection = coll;
// export const couchbaseCollection = collection;