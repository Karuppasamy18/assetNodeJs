const express = require('express');
const sequelize = require('./db');
const Employee = require('./employee');
const AssetMaster = require('./assetMaster');
const path = require('path');
const bodyParser = require('body-parser');
const AssetCategoryMaster = require('./assetCategoryMaster');
const { IssueMaster, IssueItemMaster } = require('./issueMaster');


const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/style', express.static(path.join(__dirname, 'asset/style')));

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/empCreate', (req, res) => {
    res.render('empCreate');
});

app.get('/assetCreate', async (req, res) => {


    const categories = await AssetCategoryMaster.findAll();
    console.log("cate_____", categories)

    res.render('assetCreate', { categories });
});

app.get('/assetCategoryCreate', (req, res) => {
    res.render('assetCategoryCreate');
});
app.get('/issueCreate', async (req, res) => {

    const empIns = await Employee.findAll();

    const assetIns = await AssetMaster.findAll()


    res.render('./issue/form', { empIns, assetIns });
});

sequelize.sync({ alter: true })
    .then(() => {
        console.log('Database synced successfully.');
    })
    .catch(err => {
        console.error('Error syncing database:', err);
    });


app.post('/submit-emp', async (req, res) => {
    const { firstName, lastName, email } = req.body;

    try {
        const newEmp = await Employee.create({
            firstName,
            lastName,
            email,
        });
        console.log('Employee added:', newEmp);
        res.redirect('/empList');
    } catch (error) {
        console.error('Error adding emp:', error);
        res.redirect('/emp-form');
    }
});

app.get('/empList', async (req, res) => {
    try {
        const employees = await Employee.findAll();
        employees.forEach(employee => {
            console.log("dsd    ", employee.toJSON());
        });
        res.render('empList', { employees });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/editEmployee/:id', async (req, res) => {
    const empId = req.params.id;

    try {
        const employee = await Employee.findByPk(empId);
        if (!employee) {
            return res.status(404).send('Employee not found');
        }
        res.render('editEmployee', { employee });
    } catch (err) {
        console.error('Error fetching employee:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/editEmployee/:id', async (req, res) => {
    const empId = req.params.id;
    const { firstName, lastName, email } = req.body;

    try {
        const employee = await Employee.findByPk(empId);
        if (!employee) {
            return res.status(404).send('Employee not found');
        }

        employee.firstName = firstName;
        employee.lastName = lastName;
        employee.email = email;
        await employee.save();

        console.log('Employee updated:', employee.toJSON());
        res.redirect('/empList');
    } catch (error) {
        console.error('Error updating emp:', error);
        res.redirect(`/editEmployee/${empId}`);
    }
});


app.post('/deleteEmployee/:id', async (req, res) => {
    const empId = req.params.id;

    try {
        const delEmployee = await Employee.findByPk(empId);

        if (!delEmployee) {
            return res.status(404).send('Employee not found');
        }

        await delEmployee.destroy();
        const employees = await Employee.findAll();

        res.render('empList', { employees });
    } catch (err) {
        console.error('Error deleting employee:', err);
        res.status(500).json({ error: err.message });
    }
});


app.post('/submitAsset', async (req, res) => {
    const { assetName, make, model, uom, assetCategoryId, stockQty, value } = req.body;

    try {
        const category = await AssetCategoryMaster.findByPk(assetCategoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        const newAsset = await AssetMaster.create({
            assetName,
            assetCategoryId,
            stockQty,
            make,
            model,
            uom,
            value,
            assetCategoryType: category.categoryName,
        });
        console.log('Asset added:', newAsset);
        res.redirect('/assetList');
    } catch (error) {
        console.error('Error adding emp:', error);
        res.redirect('/emp-form');
    }
});


app.get('/assetList', async (req, res) => {
    try {
        const assets = await AssetMaster.findAll({
            include: {
                model: AssetCategoryMaster,
                as: 'category',
                attributes: ['categoryName']
            }
        });

        console.log("ASDD ______", assets)


        res.render('assetList', { assets });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/editAsset/:id', async (req, res) => {
    const assetId = req.params.id;

    try {
        const asset = await AssetMaster.findByPk(assetId, {
            include: [
                { model: AssetCategoryMaster, as: 'category' },
            ]
        });
        if (!asset) {
            return res.status(404).send('Asset not found');
        }
        res.render('assetEdit', { asset });
    } catch (err) {
        console.error('Error fetching employee:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/editAsset/:id', async (req, res) => {
    const assetId = req.params.id;
    const { assetName, assetType, make, model, uom, stockQty, value } = req.body;

    try {
        const asset = await AssetMaster.findByPk(assetId);
        if (!asset) {
            return res.status(404).send('Asset not found');
        }
        asset.assetName = assetName;
        asset.assetType = assetType;
        asset.make = make;
        asset.model = model;
        asset.uom = uom;
        asset.value = value,
            asset.stockQty = stockQty
        await asset.save();
        console.log('Asset updated:', asset.toJSON());
        res.redirect('/assetList');
    } catch (error) {
        console.error('Error updating emp:', error);
        res.redirect(`/editAsset/${assetId}`);
    }
});

app.post('/deleteAsset/:id', async (req, res) => {
    const assetId = req.params.id;

    try {
        const asset = await AssetMaster.findByPk(assetId);

        if (!asset) {
            return res.status(404).send('Employee not found');
        }

        await asset.destroy();
        const assets = await AssetMaster.findAll();

        res.render('assetList', { assets });
    } catch (err) {
        console.error('Error deleting employee:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/submitAssetCategory', async (req, res) => {
    const { assetCategoryType } = req.body;
    try {
        const newAssetCategory = await AssetCategoryMaster.create({ categoryName: assetCategoryType });

        console.log('Asset Category added:', newAssetCategory);
        res.redirect('/assetCategoryList');
    } catch (error) {
        console.error('Error adding emp:', error);
        // res.redirect('/emp-form');
    }
});

app.get('/assetCategoryList', async (req, res) => {
    try {
        const assetsCategory = await AssetCategoryMaster.findAll();
        res.render('assetCategoryList', { assetsCategory });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.get('/editAssetCategory/:id', async (req, res) => {
    const assetCateId = req.params.id;

    try {
        const asset = await AssetCategoryMaster.findByPk(assetCateId);
        if (!asset) {
            return res.status(404).send('Asset not found');
        }
        res.render('assetCategoryEdit', { asset });
    } catch (err) {
        console.error('Error fetching employee:', err);
        res.status(500).json({ error: err.message });
    }
});


app.post('/editAssetCategory/:id', async (req, res) => {
    const assetCateId = req.params.id;
    const { assetCateName } = req.body;

    try {
        const asset = await AssetCategoryMaster.findByPk(assetCateName);
        if (!asset) {
            return res.status(404).send('Asset not found');
        }
        asset.categoryName = assetCateName;
        await asset.save();
        console.log('Asset updated:', asset.toJSON());
        res.redirect('/assetCategoryList');
    } catch (error) {
        console.error('Error updating emp:', error);
        res.redirect(`/editAsset/${assetId}`);
    }
});

app.post('/issueCreate', async (req, res) => {
    const { type, empId, date, assetId, qty, stockQty, reason } = req.body;

    try {
        const assetIns = await AssetMaster.findByPk(assetId);
        if (!assetIns) {
            return res.status(404).json({ message: 'Asset not found' });
        }

        const issueMaster = await IssueMaster.create({
            type,
            empId,
            date,
            reason
        });

        console.log("Issue Master ID: ", issueMaster.id);
        const issueItem = await IssueItemMaster.create({
            issueId: issueMaster.id,
            assetId,
            qty,
            stockQty
        });
        // console.log("Issue Item: ", issueItem);

        // console.log('Issue created:', issueMaster.toJSON());
        res.redirect('/issue/show');
    } catch (error) {
        console.error('Error creating issue:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/issueList', async (req, res) => {
    try {
        const issueIns = await IssueMaster.findAll({
            include: [{
                model: Employee,
                as: 'employee'
            }]
        });
        console.log("AAAAAA", issueIns)
        res.render('issue/show', { issueIns });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/issueDetails/:id', async (req, res) => {
    const issueId = req.params.id;

    try {
        const issue = await IssueMaster.findByPk(issueId, {
            include: [
                { model: Employee, as: 'employee' },
                { model: IssueItemMaster, as: 'items', include: [{ model: AssetMaster, as: 'asset' }] }
            ]
        });

        if (!issue) {
            return res.status(404).json({ message: 'Issue not found' });
        }
        console.log("OOOOOOO", issue)
        res.render('issue/issueDetails', { issue });
    } catch (error) {
        console.error('Error fetching issue details:', error);
        res.status(500).json({ error: error.message });
    }
});


app.get('/getAssetStock/:id', async (req, res) => {
    const assetId = req.params.id;
    try {
        const asset = await AssetMaster.findByPk(assetId);
        if (!asset) {
            return res.status(404).json({ message: 'Asset not found' });
        }
         res.json({ stockQty: asset.stockQty });
    } catch (error) {
        console.error('Error fetching asset stock quantity:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



// app.post('/employees', async (req, res) => {
//     try {
//         console.log(req.body)
//         const newEmployee = await Employee.create(req.body);
//         res.status(201).json(newEmployee);
//     } catch (err) {
//         res.status(400).json({ error: err.message });
//     }
// });

// app.get('/showemployees', async (req, res) => {
//     try {
//         const employees = await Employee.findAll();
//         employees.forEach(employee => {
//             console.log("dsd    ", employee.toJSON());
//         });
//         res.json(employees);
//     } catch (err) {
//         res.status(500).json({ error: err.message });
//     }
// });

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
