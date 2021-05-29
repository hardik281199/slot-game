const Couchbase = require('couchbase');

let cluster = new Couchbase.Cluster("couchbase://127.0.0.1", {
   username: 'hardik',
   password: 'Hardik@123' 
});
console.log(cluster);
let bucket = cluster.bucket("slot-game");
const collection = bucket.defaultCollection();
module.exports.couchbaseCollection = collection;
