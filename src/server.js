require('dotenv').config({ path: require('path').join(__dirname, '.env') });
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
const purchaseRequestRoutes = require('./routes/purchaseRequestRoutes');
const purchaseOrderRoutes = require('./routes/purchaseOrderRoutes');
const goodsReceiptRoutes = require('./routes/goodsReceiptRoutes');
const vendorInvoiceRoutes = require('./routes/vendorInvoiceRoutes');
const depreciationProfileRoutes = require('./routes/depreciationProfileRoutes');
const depreciationEntryRoutes = require('./routes/depreciationEntryRoutes');
const assetValuationRoutes = require('./routes/assetValuationRoutes');
const maintenanceRequestRoutes = require('./routes/maintenanceRequestRoutes');
const preventiveScheduleRoutes = require('./routes/preventiveScheduleRoutes');
const workOrderRoutes = require('./routes/workOrderRoutes');
const serviceRecordRoutes = require('./routes/serviceRecordRoutes');
const incidentRoutes = require('./routes/incidentRoutes');
const warrantyRoutes = require('./routes/warrantyRoutes');
const amcContractRoutes = require('./routes/amcContractRoutes');
const amcAssetLinkRoutes = require('./routes/amcAssetLinkRoutes');
const warrantyClaimRoutes = require('./routes/warrantyClaimRoutes');
const itAssetProfileRoutes = require('./routes/itAssetProfileRoutes');
const softwareCatalogRoutes = require('./routes/softwareCatalogRoutes');
const approvedSoftwarePolicyRoutes = require('./routes/approvedSoftwarePolicyRoutes');
const softwareLicenseRoutes = require('./routes/softwareLicenseRoutes');
const licenseAllocationRoutes = require('./routes/licenseAllocationRoutes');
const softwareInstallationRoutes = require('./routes/softwareInstallationRoutes');
const approvalTemplateRoutes = require('./routes/approvalTemplateRoutes');
const approvalInstanceRoutes = require('./routes/approvalInstanceRoutes');
const approvalActionRoutes = require('./routes/approvalActionRoutes');
const approvalDelegationRoutes = require('./routes/approvalDelegationRoutes');
const shiftRoutes = require('./routes/shiftRoutes');
const assetRequestRoutes = require('./routes/assetRequestRoutes');
const disposalRecordRoutes = require('./routes/disposalRecordRoutes');
const auditPlanRoutes = require('./routes/auditPlanRoutes');
const verificationRecordRoutes = require('./routes/verificationRecordRoutes');
const auditExceptionRoutes = require('./routes/auditExceptionRoutes');
const auditEventRoutes = require('./routes/auditEventRoutes');
const documentRoutes = require('./routes/documentRoutes');
const alertConfigRoutes = require('./routes/alertConfigRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const filterPresetRoutes = require('./routes/filterPresetRoutes');
const outboxEventRoutes = require('./routes/outboxEventRoutes');
const telemetryEventRoutes = require('./routes/telemetryEventRoutes');


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
app.use('/api/purchase-requests', purchaseRequestRoutes);
app.use('/api/purchase-orders', purchaseOrderRoutes);
app.use('/api/goods-receipts', goodsReceiptRoutes);
app.use('/api/vendor-invoices', vendorInvoiceRoutes);
app.use('/api/depreciation-profiles', depreciationProfileRoutes);
app.use('/api/depreciation-entries', depreciationEntryRoutes);
app.use('/api/asset-valuations', assetValuationRoutes);
app.use('/api/maintenance-requests', maintenanceRequestRoutes);
app.use('/api/preventive-schedules', preventiveScheduleRoutes);
app.use('/api/work-orders', workOrderRoutes);
app.use('/api/service-records', serviceRecordRoutes);
app.use('/api/incidents', incidentRoutes);
app.use('/api/warranties', warrantyRoutes);
app.use('/api/amc-contracts', amcContractRoutes);
app.use('/api/amc-asset-links', amcAssetLinkRoutes);
app.use('/api/warranty-claims', warrantyClaimRoutes);
app.use('/api/it-asset-profiles', itAssetProfileRoutes);
app.use('/api/software-catalog', softwareCatalogRoutes);
app.use('/api/approved-software-policies', approvedSoftwarePolicyRoutes);
app.use('/api/software-licenses', softwareLicenseRoutes);
app.use('/api/license-allocations', licenseAllocationRoutes);
app.use('/api/software-installations', softwareInstallationRoutes);
app.use('/api/approval-templates', approvalTemplateRoutes);
app.use('/api/approval-instances', approvalInstanceRoutes);
app.use('/api/approval-actions', approvalActionRoutes);
app.use('/api/approval-delegations', approvalDelegationRoutes);
app.use('/api/shifts', shiftRoutes);
app.use('/api/asset-requests', assetRequestRoutes);
app.use('/api/disposal-records', disposalRecordRoutes);
app.use('/api/audit-plans', auditPlanRoutes);
app.use('/api/verification-records', verificationRecordRoutes);
app.use('/api/audit-exceptions', auditExceptionRoutes);
app.use('/api/audit-events', auditEventRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/alert-configs', alertConfigRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/filter-presets', filterPresetRoutes);
app.use('/api/outbox-events', outboxEventRoutes);
app.use('/api/telemetry-events', telemetryEventRoutes);


const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
