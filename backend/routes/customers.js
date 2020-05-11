const express = require('express');
const extractFile = require('../middleware/file')
const CustomerController = require('../controllers/customers');


const checkAuth = require('../middleware/check-auth');

const router = express.Router();


router.post("", checkAuth, extractFile, CustomerController.createCustomers);

router.put('/:id', checkAuth, extractFile, CustomerController.updateCustomer);

router.get('', checkAuth, CustomerController.getCustomers);

router.get('/:id', checkAuth, CustomerController.getCustomer);

router.delete('/:id', checkAuth, CustomerController.deleteCustomer);

module.exports = router;
