require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('./models')

const authRoutes = require('./routes/authRoutes');
const departmentRoutes = require('./routes/departmentRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const assetRoutes = require('./routes/assetRoutes');
const itemMasterRoutes = require('./routes/itemMasterRoutes');
const assetCategoryRoutes = require('./routes/assetCategoryRoutes');
const vendorRoutes = require('./routes/vendorRoutes');
const unitOfMeasureRoutes = require('./routes/unitOfMeasureRoutes');
const locationRoutes = require('./routes/locationRoutes');
const roleRoutes = require('./routes/roleRoutes');
const userRoleRoutes = require('./routes/userRoleRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const rolePermissionRoutes = require('./routes/rolePermissionRoutes');
const assetLifecycleEventRoutes = require('./routes/assetLifecycleEventRoutes');
const assetAssignmentRoutes = require('./routes/assetAssignmentRoutes');
const assetTransferRoutes = require('./routes/assetTransferRoutes')
const assetLoanRoutes = require('./routes/assetLoanRoutes');
const assetRelationshipRoutes = require('./routes/assetRelationshipRoutes');
const assetLocationEventRoutes = require('./routes/assetLocationEventRoutes');
const inventoryBalanceRoutes = require('./routes/inventoryBalanceRoutes');
const inventoryBatchRoutes = require('./routes/inventoryBatchRoutes');
const inventoryTransactionRoutes = require('./routes/inventoryTransactionRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/item-masters', itemMasterRoutes);
app.use('/api/asset-categories', assetCategoryRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/units-of-measure', unitOfMeasureRoutes);
app.use('/api/locations', locationRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/user-roles', userRoleRoutes);
app.use('/api/permissions', permissionRoutes)
app.use('/api/role-permissions', rolePermissionRoutes)
app.use('/api/asset-lifecycle-events', assetLifecycleEventRoutes);
app.use('/api/asset-assignments', assetAssignmentRoutes);
app.use('/api/asset-transfers', assetTransferRoutes);
app.use('/api/asset-loans', assetLoanRoutes)
app.use('/api/asset-relationships', assetRelationshipRoutes);
app.use('/api/asset-location-events', assetLocationEventRoutes);
app.use('/api/inventory-balances', inventoryBalanceRoutes);
app.use('/api/inventory-batches', inventoryBatchRoutes);
app.use('/api/inventory-transactions', inventoryTransactionRoutes);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
