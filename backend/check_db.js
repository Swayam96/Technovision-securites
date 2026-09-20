const { fetchAll } = require('./src/db');
(async () => {
   console.log('Roles:', await fetchAll("SELECT * FROM org_roles"));
   console.log('Designations:', await fetchAll("SELECT * FROM designations"));
   console.log('Departments:', await fetchAll("SELECT * FROM departments"));
   process.exit(0);
})();
