const couchbase = require('couchbase');

const cluster = new couchbase.Cluster("couchbase://localhost", {
   username: 'hardik',
   password: 'Hardik@123',
});
var bucket = cluster.bucket('slot-game');
var coll = bucket.defaultCollection();

/**
 * connection database and get data
 * @param {id} key primary key of document 
 * @returns return result
 */
const getObject = (key) => {
   console.log(key);
   return new Promise((resolve, reject) => {
      coll.get(key, (err, res) => {
         console.log(res);
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

module.exports = {
   couchbaseCollection: coll,
   getObject, upsertObject
};
// export const couchbaseCollection = collection;