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

**Prerequisites**

- It is necessary that locally you create a db named after your app using camelCase. Example: 

> If your app name is my-awesome-app, you have to create a db in your local mongo named myAwesomeApp

- It is necessary to create a collection inside this db called counters with a document for each of the other collections we want to keep track of. Example: 

> Your db myAwesomeApp has 2 collectiones, myAwesomeBooks and myAwesomeSongs. Then you have to create a counters collection with 2 documents, one for each of the collections that our db has:


```javascript
{
    "_id": "myAwesomeBooks",
    "seq": 8
}
{
    "_id": "myAwesomeSongs",
    "seq": 8
}
```


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

Receives an object with some needed params and returns a promise. This promise resolves if the update took place or rejects if it failed.

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