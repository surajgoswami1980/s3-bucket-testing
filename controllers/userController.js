const fs = require('fs');
const path = require('path');
const axios = require('axios');
const s3 = require('../config/s3');
const User = require('../models/User');

async function uploadToS3(filePath, fileName) {
  const fileContent = fs.readFileSync(filePath);
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: fileContent,
    // ACL: 'public-read'
  };
  const data = await s3.upload(params).promise();
  return data.Location;
}

exports.showForm = (req, res) => {
  res.render('form');
};

exports.submitForm = async (req, res) => {
  try {
    const { name, phone, imageUrl } = req.body;
    let finalImageUrl = '';

    if (req.file) {
      finalImageUrl = await uploadToS3(req.file.path, req.file.originalname);
      fs.unlinkSync(req.file.path);
    } else if (imageUrl) {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const filename = `remote-${Date.now()}.jpg`;
      const tempPath = path.join(__dirname, '../uploads', filename);
      fs.writeFileSync(tempPath, response.data);
      finalImageUrl = await uploadToS3(tempPath, filename);
      fs.unlinkSync(tempPath);
    }

    const newUser = new User({ name, phone, imageUrl: finalImageUrl });
    await newUser.save();

    res.redirect('/users');
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong.");
  }
};

exports.showUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ _id: -1 });
    res.render('users', { users });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error fetching users');
  }
};
