const bcrypt = require('bcryptjs');
const User = require('../models/users');
const Organization = require('../models/organizations');
const Employee = require('../models/employees');
const Department = require('../models/departments');
const UserRole = require('../models/user_roles');
const RolePermission = require('../models/role_permissions');
const { signToken } = require('../utils/jwt');
const { seedDefaultsForOrg } = require('../utils/seedDefaults');

async function register(req, res) {
  try {
    const { orgName, email, password, name, department } = req.body;

    if (!orgName || !email || !password || !name) {
      return res.status(400).json({ error: 'orgName, email, password, and name are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }

    const org = await Organization.create({ name: orgName });
    const roleByCode = await seedDefaultsForOrg(org._id);

    let departmentDoc = null;
    if (department) {
      departmentDoc = await Department.findOne({ org_id: org._id, name: department });
      if (!departmentDoc) {
        departmentDoc = await Department.create({ org_id: org._id, name: department });
      }
    }

    const employee = await Employee.create({
      org_id: org._id,
      name,
      department_id: departmentDoc ? departmentDoc._id : null,
      email,
    });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      org_id: org._id,
      employee_id: employee._id,
      email,
      password_hash,
    });

    // First user of a new org is provisioned as its Super Admin.
    const superAdminRole = roleByCode.get('SUPER_ADMIN');
    await UserRole.create({
      org_id: org._id,
      user_id: user._id,
      role_id: superAdminRole._id,
    });

    const token = signToken({ userId: user._id.toString(), orgId: org._id.toString() });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password_hash');
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    user.last_login_at = new Date();
    await user.save();

    const token = signToken({ userId: user._id.toString(), orgId: user.org_id.toString() });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function getMe(req, res) {
  try {
    const user = await User.findById(req.userId).populate('employee_id');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userRole = await UserRole.findOne({ user_id: user._id }).populate('role_id');
    const role = userRole ? userRole.role_id : null;

    let permissionCodes = [];
    if (role) {
      const rolePermissions = await RolePermission.find({ role_id: role._id }).populate('permission_id');
      permissionCodes = rolePermissions.map((rp) => rp.permission_id.code);
    }

    const employee = user.employee_id;
    let departmentName = null;
    if (employee && employee.department_id) {
      const department = await Department.findById(employee.department_id);
      departmentName = department ? department.name : null;
    }

    res.json({
      id: user._id,
      name: employee ? employee.name : user.email,
      email: user.email,
      role: role ? role.code : null,
      department: departmentName,
      avatarUrl: user.avatar_url || '',
      permissions: permissionCodes,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { register, login, getMe };
