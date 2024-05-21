const express = require('express');
const router = express.Router();
const addressController = require('../controller/address');



router.post('/addAddress',addressController.postAddress);

router.get('/getAllAddresses',addressController.getAllAddresses);

router.put('/editAddress/:id',addressController.editAddress);

router.delete('/deleteAddress/:id',addressController.deleteAddress);



module.exports = router;