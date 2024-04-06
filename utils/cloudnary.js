// cloudinary.js

const cloudinary = require('cloudinary').v2;

// Initialize Cloudinary with your cloud credentials
cloudinary.config({ 
  cloud_name: 'duhf6oxcf', 
  api_key: '447214718248869', 
  api_secret: 'F_gCUaP0tB7KPsero-Mri9yNSdM' 
});

module.exports = cloudinary;
