const couchbase = require('couchbase');

const cluster = new couchbase.Cluster("couchbase://localhost", {
   username: process.env.COUCHBASE_USERNAME,
   password: process.env.COUCHBASE_PASSWORD,
});
var bucket = cluster.bucket('slot-game');
var coll = bucket.defaultCollection();

/**
 * connection database and get data
 * @param {id} key primary key of document 
 * @returns return result
 */
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

/**
 * connection data base && update data or insert data 
 * @param {id} key primary key of document 
 * @param {data} data upsert data this key data
 * @returns return result
 */
const upsertObject = (key,data) =>{
   return new Promise((resolve, reject)=>{
      coll.upsert(key,data,(err, res) =>{
         if (err) {
            return reject(err);
         } else {
            return resolve(res);
         }
      });
   });
}

/**
 * connection data base && get data using N1QL
 * @param {query} queryData 
 * @returns 
 */
const couchbaseN1QLCollection = (queryData) =>{
   return new Promise((resolve , reject)=>{
      cluster.query(queryData,(err,res) =>{
         if (err) {
            return reject(err);
         } else {
            return resolve(res);
         }
      });
   });
}


module.exports = {
   couchbaseCollection : coll,
   cluster,
   getObject, upsertObject,couchbaseN1QLCollection
};
// export const couchbaseCollection = collection;