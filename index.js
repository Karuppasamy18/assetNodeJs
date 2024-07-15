const express = require('express');
const sequelize = require('./db');
const Employee = require('./Models/employee');
const AssetMaster = require('./Models/assetMaster');
const path = require('path');
const bodyParser = require('body-parser');
const AssetCategoryMaster = require('./Models/assetCategoryMaster');
const { IssueMaster, IssueItemMaster } = require('./Models/issueMaster');


const app = express();
const PORT = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use('/style', express.static(path.join(__dirname, 'asset/style')));

app.set('view engine', 'pug');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/empCreate', (req, res) => {
  res.render('./Employee/empCreate');
});

app.get('/assetCreate', async (req, res) => {


  const categories = await AssetCategoryMaster.findAll();

  res.render('./Asset/assetCreate', { categories });
});

app.get('/assetCategoryCreate', (req, res) => {
  res.render('./Asset/assetCategoryCreate');
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
    res.redirect('./Employee/empList');
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
    res.render('./Employee/empList', { employees });
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
    res.render('./Employee/editEmployee', { employee });
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
    res.redirect('./Employee/empList');
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

    res.render('./Employee/empList', { employees });
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
    res.redirect('./Asset/assetList');
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


    res.render('./Asset/assetList', { assets });
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
    res.render('./Asset/assetEdit', { asset });
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
    res.redirect('./Asset/assetList');
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

    res.render('./Asset/assetList', { assets });
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
    res.redirect('./Assetcategory/assetCategoryList');
  } catch (error) {
    console.error('Error adding emp:', error);
    // res.redirect('/emp-form');
  }
});

app.get('/assetCategoryList', async (req, res) => {
  try {
    const assetsCategory = await AssetCategoryMaster.findAll();
    res.render('./AssetCategory/assetCategoryList', { assetsCategory });
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
    res.render('./AssetCategory/assetCategoryEdit', { asset });
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
    res.redirect('./AssetCategory/assetCategoryList');
  } catch (error) {
    console.error('Error updating emp:', error);
    res.redirect(`/editAsset/${assetId}`);
  }
});


app.post('/deleteAssetCategory/:id', async (req, res) => {
  const categoryId = req.params.id;

  try {
    const category = await AssetCategoryMaster.findByPk(categoryId);

    if (!category) {
      return res.status(404).send('Category not found');
    }

    await category.destroy();
    const assetsCategory = await AssetCategoryMaster.findAll();

    res.render('./AssetCategory/assetCategoryList', { assetsCategory });
  } catch (err) {
    console.error('Error deleting Category:', err);
    res.status(500).json({ error: err.message });
  }
});



app.post('/issueCreate', async (req, res) => {
  const { type, empId, date, assetId, qty, stockQty, reason } = req.body;

  try {
    const assetIns = await AssetMaster.findByPk(assetId);

    if (type === 'Issue') {
      if (assetIns.stockQty < qty) {
        return res.status(400).json({ message: 'Insufficient stock quantity for issue.' });
      }
      assetIns.stockQty -= parseFloat(qty);
      try {
        await assetIns.save();
        console.log("Stock Quantity updated in the database.");

      } catch (error) {
        console.error('Error saving asset:', error);
        return res.status(500).json({ error: 'Error saving asset stock quantity.' });
      }
    } else {
      if (assetIns.stockQty < qty) {
        return res.status(400).json({ message: 'Insufficient stock quantity for issue.' });
      }
      assetIns.stockQty += parseFloat(qty);
      try {
        await assetIns.save();
        console.log("Stock Quantity updated in the database.");

      } catch (error) {
        console.error('Error saving asset:', error);
        return
      }
    }
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
    res.redirect('/issueList');
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
    res.render('./issue/show', { issueIns });
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

app.post('/deleteIssue/:id', async (req, res) => {
  const issueId = req.params.id;

  try {

    const issue = await IssueMaster.findByPk(issueId, {
      include: [
        {
          model: IssueItemMaster, as: 'items',
          include: [{ model: AssetMaster, as: 'asset' }]
        }
      ]
    });

    if (!issue) {
      return res.status(404).send('Issue not found');
    }

    const assetIns = issue.items[0].asset;
    const qty = issue.items[0].qty;

    try {
      console.log("ASSS  ", issue.type)


      if (issue.type === 'Issue') {
        if (assetIns.stockQty < qty) {
          return res.status(400).json({ message: 'Insufficient stock quantity for issue.' });
        }
        console.log("ASSDD", assetIns.stockQty)
        console.log("SSS  ", qty)

        assetIns.stockQty += parseFloat(qty);
 
      } else if (issue.type === 'Return') {
        assetIns.stockQty -= parseFloat(qty);

      }
      await assetIns.save();
      console.log("Stock Quantity updated in the database.");

    } catch (error) {
      console.error('Error saving asset:', error);
      return res.status(500).json({ error: 'Error saving asset stock quantity.' });
    }

    try {
      await issue.destroy();
      console.log("Issue deleted successfully.");
      return res.json({ message: 'Issue deleted successfully.', asset: assetIns });

    } catch (error) {
      console.error('Error deleting issue:', error);
      return res.status(500).json({ error: 'Error deleting issue.' });
    }
  } catch (err) {
    console.error('Error deleting issue:', err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/stockList', async (req, res) => {
  try {
    const assetIns = await AssetMaster.findAll({
      include: {
        model: AssetCategoryMaster,
        as: 'category',
        attributes: ['categoryName'],
      },
    });


    const totalsByCategory = assetIns.reduce((acc, asset) => {
      const categoryName = asset.category ? asset.category.categoryName : 'Uncategorized';
      if (!acc[categoryName]) {
        acc[categoryName] = {
          totalQty: 0,
          totalValue: 0
        };
      }
      acc[categoryName].totalQty += asset.stockQty || 0;
      acc[categoryName].totalValue += asset.value || 0;
      return acc;
    }, {});

    const totalsArray = Object.keys(totalsByCategory).map(categoryName => ({
      categoryName: categoryName,
      totalQty: totalsByCategory[categoryName].totalQty,
      totalValue: totalsByCategory[categoryName].totalValue
    }));

    res.render('stockList', { assetIns, totalsArray });
  } catch (error) {
    console.error('Error fetching assets:', error);
    res.status(500).send('Server Error');
  }
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
