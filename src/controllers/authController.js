const bcrypt = require('bcryptjs');
const User = require('../models/users');
const Organization = require('../models/organizations');
const { signToken } = require('../utils/jwt');

async function register(req, res) {
  try {
    const { orgName, email, password } = req.body;

    if (!orgName || !email || !password) {
      return res.status(400).json({ error: 'orgName, email, and password are required' });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ error: 'A user with this email already exists' });
    }

    const org = await Organization.create({ name: orgName });

    const password_hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      org_id: org._id,
      email,
      password_hash,
    });

    const token = signToken({ userId: user._id.toString(), orgId: org._id.toString() });

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email, orgId: org._id },
    });
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

    res.json({
      token,
      user: { id: user._id, email: user.email, orgId: user.org_id },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { register, login };
