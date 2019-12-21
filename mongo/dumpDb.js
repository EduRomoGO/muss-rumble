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
      const mongoDump = `mongodump ${dbHost ? `-h ${dbHost}` : ''} -d ${dbName} -c ${collectionName} ${dbUser ? `-u ${dbUser}` : ''} ${dbPass ? `-p ${dbPass}` : ''} -o ${dumpLocation}`;

      const dumpResult = shell.exec(mongoDump);
      if (!dumpResult || dumpResult.code !== 0) {
        console.log(`Error while dumping ${collectionName} collection`);
        console.log('mongoDump command:');
        console.log(mongoDump);
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
