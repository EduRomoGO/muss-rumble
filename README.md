# Muss-Rumble

This library includes a miscellanea of utilities:

- MongoUtil to manage mongo app connections and more
- An utility to encrypt/decrypt data easily
- A function to transform a number from decimal to binary
- A function to update the data of a json file with more json data
- Provides some useful node standalone scripts that you can use directly with npm

To install it simply type

`npm install --save muss-rumble`

## MongoUtil

This utility provides some helpers to manage mongo db based apps like connect/disconnect from a db, get the db item, etc.


### How to use it

Import the module:

```javascript
const { mongoUtil } = require('muss-rumble');
```

### Helpers

#### updateLocalDb()

Method to populate local db with prod db data. It will connect to prod db, dump all the data on your local machine and then update local db with this data. Note that this is a **destructive** operation and can not be undone. All the data in your local machine will be overriden by the data on prod db. Below there is an usage example:

```javascript
const localDbName = 'localDbName';
const prodDbName = 'prodDbName';
const prodDbHost = 'prodHost.mlab.com:27444';
const prodDbUser = 'eduromogo';
const prodDbPass = '12345678';
const prodDbUri = `mongodb://${prodDbUser}:${prodDbPass}@${prodDbHost}/${prodDbName}`;
const dumpLocation = 'path/to/your/backups';

mongoUtil.updateLocalDb({prodDbName, prodDbUri, prodDbHost, prodDbUser, prodDbPass, dumpLocation, localDbName})
```

Here you pass an object with all the info needed to connect to your prod and local dbs. The method receives an object and returns a promise that will resolve successfully if the update took place or  will be rejected if it failed.


#### getDb(options)

Receives an options object and return the database connection object or logs an error if no db object is present. 

*Options object props*

**silent** (Boolean): wether or not in should log error when failing


#### dropDb(db)

Receives the db connection object and returns a promise. The promise will resolve when all the collections of the db has been dropped. Pending to implement a rejection on failure.


#### findLastElementAdded(db, collection)

Receives a db and a collection of this db and returns the last element added to this collection.


#### changeGeneratedIdsToSequentialIds(db, collection)

Receives a db and a collection and return a promise. The promise will resolve after it replaces all the generated ids by sequential ids or is rejected if something went wrong.


### Scripts

You can find all available scripts navigating to `node_modules/muss-rumble/mongo/scripts/`  

To use an script simply add your own script to your package.json referencing the `muss-rumble` script you want to use like this:

```js
  "scripts": {
    "yourScriptName": "node ./node_modules/muss-rumble/mongo/scripts/someScriptName.js",
  },
```

This comes in handy to perform some operations on db through npm so there is no need to open your GUI or mongo console.


### Scripts for robomongo (or any other gui)

```js
// This ones shows size stats for each document in a collection
db.cards.find().forEach(function(obj)
{
  const size = Object.bsonsize(obj);

  const stats = {
    '_id': obj._id, 
    'bytes': size, 
    'KB': Math.round(size/(1024)), 
    'MB': Math.round(size/(1024*1024))
  };

  print(stats);
});
```

```js
// This one finds the largest document in a collection and prints its id and size
let max = {
    id: 0,
    size: 0,
};
db.cards.find().forEach(function(obj) {
    const curr = Object.bsonsize(obj); 
    if(max.size < curr) {
        max.size = curr;
        max.id = obj._id;
    } 
})
print(max);
```
