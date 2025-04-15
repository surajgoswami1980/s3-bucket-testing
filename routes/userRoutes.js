const express = require('express');
const multer = require('multer');
const router = express.Router();
const userController = require('../controllers/userController');

const upload = multer({ dest: 'uploads/' });

router.get('/', userController.showForm);
router.post('/submit', upload.single('image'), userController.submitForm);
router.get('/users', userController.showUsers);

module.exports = router;
