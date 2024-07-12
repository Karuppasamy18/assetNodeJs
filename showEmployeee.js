const sequelize = require('./db');  // Import the sequelize instance
const Employee = require('./employee');  // Import the Employee model

(async () => {
  try {
    // Ensure the database is synced
    await sequelize.sync();

    // Fetch all employees
    const employees = await Employee.findAll();

    console.log('All emplssssoyees:'+employees);
    employees.forEach(employee => {
      console.log("sssssssssss"+employee.toJSON());
    });
  } catch (err) {
    console.error('Error fetching employees:', err);
  } finally {
    await sequelize.close();   
  }
})();
