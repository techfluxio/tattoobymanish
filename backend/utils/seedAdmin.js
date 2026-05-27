const Admin = require('../models/Admin');

const seedAdmin = async () => {
  try {
    const exists = await Admin.findOne({ username: process.env.ADMIN_USERNAME || 'manish' });
    if (exists) return;

    await Admin.create({
      username: process.env.ADMIN_USERNAME || 'manish',
      password: process.env.ADMIN_PASSWORD || 'TattooByManish@2024!',
    });
    console.log('✅ Admin account created');
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  }
};

module.exports = seedAdmin;
