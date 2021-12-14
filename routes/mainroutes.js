const express = require('express');
const controller = require('../controllers/mainController');

const router = express.Router();

//homepage

router.get('/', controller.index);
//aboutpage

router.get('/aboutus', controller.aboutus);
//contactus

router.get('/contactus', controller.contactus);

module.exports = router;