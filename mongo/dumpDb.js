const mongodb = require('mongodb');
var shell = require('shelljs');

const connect = (dbUri) => {
  console.log(`connecting to db ${dbUri}`);
  return mongodb.MongoClient.connect(dbUri);
}

const getDbCollections = (dbClient, dbName) => {
  console.info(`getting db collections`);
  return dbClient.db(dbName).collections();
}

const getCollectionNames = collections => collections.map(collection => collection.s.name);


module.exports = async ({ dbData, dumpLocation }) => {
  const { dbName, dbUri, dbHost, dbUser, dbPass } = dbData;

  try{

    function dumpAll (collectionNames) {
      console.info('dumping collections');
      collectionNames.forEach(dump);
    }

    function dump(collectionName) {
        const mongoDump = `mongodump -h ${dbHost} -d ${dbName} -c ${collectionName} -u ${dbUser} -p ${dbPass} -o ${dumpLocation}`;

        if (shell.exec(mongoDump).code !== 0) {
            shell.echo(`Error: mongo dump failed for collection ${collectionName}`);
            shell.exit(1);
        }
    }

    const dbClient = await connect(dbUri);
    const collections = await getDbCollections(dbClient, dbName);
    const collectionNames = getCollectionNames(collections);
    await dumpAll(collectionNames);

    return collectionNames;
  } catch (err) {
    console.log(err);
  }
};
