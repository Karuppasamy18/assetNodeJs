# Asset Management Project

## Objective
The objective of this project is to build a Node.js web application to help a company track its assets used by employees. Assets include tangible items like laptops, cell phones, modems, tools, etc.

## Detailed Requirements
1. **Employee Master**: Add/Edit/View all employees in the company. Includes filters for active/inactive employees and search capabilities.
2. **Asset Master**: Add/Edit/View all assets in the company. Includes filters for asset type, search by make/model, serial number, and unique ID.
3. **Asset Category Master**: Manage various hardware types (e.g., Laptop, Mobile Phone, Screw Driver, Drill Machine).
4. **Stock View**: Provides a bird’s eye view of assets in stock, showing totals by branch and total value in the footer.
5. **Issue Asset**: Allows users to issue an asset to an employee.
6. **Return Asset**: Allows users to get back an asset from an employee, capturing reasons for return (upgrade, repair, resignation).
7. **Scrap Asset**: Allows users to mark an asset as obsolete, removing it from visibility in most pages except reports.
8. **Asset History**: View the entire history of an asset from purchase to scrapping, helping to understand the utilization of investment.

## Tech Stack
- **Backend**: Node.js (Express server)
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Templating**: Jade (Pug)
- **Frontend**: Bootstrap, CSS, DataTables.net

## Installation

1. **Clone the repository**:
   ```sh
   git clone https://github.com/Karuppasamy18/assetNodeJs.git
   cd assetNodeJs
   
   
DB_NAME=asset1
DB_USER=raaj
DB_PASSWORD=root
DB_HOST=localhost
DB_PORT=5432


Steps :
     
     1.Create Db in PostGres
     
     2.Install Neccessary NPM packages
     
npx sequelize-cli db:migrate


npm start


 


