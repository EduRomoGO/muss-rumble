'use strict';

module.exports = async ({prodDbName, prodDbUri, prodDbHost, prodDbUser, prodDbPass, dumpLocation, localDbName, dumpDb, restoreDb }) => {
  try {
    const collectionNames = await dumpDb({ dbName: prodDbName, dbUri: prodDbUri, dbHost: prodDbHost, dbUser: prodDbUser, dbPass: prodDbPass, dumpLocation });
    return restoreDb({ restoreLocalDb: true, dumpLocation: `${dumpLocation}/${prodDbName}`, collectionNames });
  } catch (err) {
    console.log(`err while updating local db`);
  }
};
