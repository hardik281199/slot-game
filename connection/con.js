const Couchbase = require('couchbase');

var cluster = new Couchbase.Cluster("couchbase://127.0.0.1", {
   username: 'hardik',
   password: 'Hardik@123' 
});
console.log(cluster);
var bucket = cluster.bucket("slot-game");
module.exports.bucket= bucket;
