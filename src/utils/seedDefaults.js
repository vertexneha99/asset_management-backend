const Role = require('../models/roles');
const Permission = require('../models/permissions');
const RolePermission = require('../models/role_permissions');

// Mirrors AppRole in frontend lib/models/auth_models.dart — keep in sync.
const ROLE_NAMES = {
  SUPER_ADMIN: 'Super Admin',
  ASSET_MANAGER: 'Asset Manager',
  STORE_MANAGER: 'Store Manager',
  APPROVER: 'Approver',
  PROCUREMENT_OFFICER: 'Procurement Officer',
  TECHNICIAN: 'Technician / Engineer',
  AUDITOR: 'Auditor',
  EMPLOYEE: 'Employee',
  FINANCE_USER: 'Finance Officer',
};
const ROLE_CODES = Object.keys(ROLE_NAMES);

// Mirrors AppPermissions in the same file.
const PERMISSION_CODES = [
  'assets.view', 'assets.create', 'assets.edit', 'assets.assign', 'assets.transfer',
  'inventory.view', 'inventory.create', 'inventory.issue', 'inventory.transfer', 'inventory.adjust',
  'maintenance.view', 'maintenance.manage',
  'procurement.view', 'procurement.manage',
  'approvals.view', 'approvals.approve',
  'audit.view', 'audit.verify',
  'reports.view', 'depreciation.view',
  'locations.manage', 'users.manage', 'settings.manage',
];

// Mirrors RolePermissions._mapping in the same file.
const ROLE_PERMISSIONS = {
  SUPER_ADMIN: PERMISSION_CODES,
  ASSET_MANAGER: ['assets.view', 'assets.create', 'assets.edit', 'assets.assign', 'assets.transfer', 'maintenance.view', 'reports.view', 'locations.manage'],
  STORE_MANAGER: ['inventory.view', 'inventory.create', 'inventory.issue', 'inventory.transfer', 'inventory.adjust', 'assets.view'],
  APPROVER: ['approvals.view', 'approvals.approve', 'assets.view', 'inventory.view', 'procurement.view'],
  PROCUREMENT_OFFICER: ['procurement.view', 'procurement.manage', 'inventory.view', 'assets.view', 'reports.view'],
  TECHNICIAN: ['maintenance.view', 'maintenance.manage', 'assets.view', 'inventory.view'],
  AUDITOR: ['audit.view', 'audit.verify', 'assets.view', 'inventory.view', 'reports.view'],
  EMPLOYEE: ['assets.view', 'approvals.view'],
  FINANCE_USER: ['assets.view', 'reports.view', 'depreciation.view', 'procurement.view'],
};

/**
 * Idempotent: safe to call on every org registration. Permissions are global
 * (no org_id on the Permission schema); Roles and RolePermission links are
 * upserted per-org so re-running never duplicates data.
 */
async function seedDefaultsForOrg(orgId) {
  const permissionDocs = await Promise.all(
    PERMISSION_CODES.map(async (code) => {
      const [module, action] = code.split('.');
      return Permission.findOneAndUpdate(
        { code },
        { code, module, action },
        { upsert: true, new: true }
      );
    })
  );
  const permissionByCode = new Map(permissionDocs.map((p) => [p.code, p]));

  const roleDocs = await Promise.all(
    ROLE_CODES.map((code) =>
      Role.findOneAndUpdate(
        { org_id: orgId, code },
        { org_id: orgId, code, name: ROLE_NAMES[code], is_system_role: true },
        { upsert: true, new: true }
      )
    )
  );
  const roleByCode = new Map(roleDocs.map((r) => [r.code, r]));

  const links = [];
  for (const roleCode of ROLE_CODES) {
    const role = roleByCode.get(roleCode);
    for (const permCode of ROLE_PERMISSIONS[roleCode]) {
      const permission = permissionByCode.get(permCode);
      links.push(
        RolePermission.findOneAndUpdate(
          { role_id: role._id, permission_id: permission._id },
          { role_id: role._id, permission_id: permission._id },
          { upsert: true }
        )
      );
    }
  }
  await Promise.all(links);

  return roleByCode;
}

module.exports = { seedDefaultsForOrg, ROLE_CODES, ROLE_PERMISSIONS };
