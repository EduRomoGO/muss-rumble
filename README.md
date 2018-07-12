# Muss-Rumble

This library includes a miscellanea of utilities:

- MongoUtil to manage mongo app connections and more
- An utility to encrypt/decrypt data easily
- A function to transform a number from decimal to binary
- A function to update the data of a json file with more json data

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

#### getDBName()

Returns the local db name

```javascript
mongoUtil.getDBName()
```

#### updateLocalDb()

Method to populate local db with prod db data. It will connect to prod db, dump all the data on your local machine and then update local db with this data. Note that this is a **destructive** operation and can not be undone. All the data in your local machine will be overriden by the data on prod db. Below there is an usage example:

```javascript
const localDbName = mongoUtil.getDBName();
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