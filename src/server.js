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

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
