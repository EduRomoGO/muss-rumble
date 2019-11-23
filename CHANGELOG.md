CHANGELOG
=========

3.22.0 / 2019-11-10
-------------------

  * Feat: more flexibility offered for dumping

3.21.1 / 2019-11-09
-------------------

  * Feat: more flexibility offered for dumping/restoring dbs

3.20.1 / 2019-11-09
-------------------

  * Fix: updateLocalDb was using the way of connecting to db of an older version of mongodb

4.0.0 / 2019-11-23
-------------------

  * Breaking changes: 
    - Now mongoUtil is exported as a function that receives a config object which should include dbName and dbUrl
    - Removed getUrl/getDbName methods for obvious reasons
  
  * Refactor: Reorganize files

4.0.1 / 2019-11-23
-------------------

  * Fix: Send correct error messages for mongoUtil inicialization
