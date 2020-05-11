const Customer = require('../models/customer');

exports.createCustomers = (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");
    const customer = new Customer({
        name: req.body.name,
        address: req.body.address,
        imagePath: url + "/images/" + req.file.filename,
        contact: req.body.contact,
        gst: req.body.gst,
        creator: req.userData.userId
    });
    customer.save().then(createdCustomer => {
            res.status(201).json({
                message: 'Customer added successfully',
                customer: {
                    ...createdCustomer,
                    id: createdCustomer._id
                }
            });
        })
        .catch(error => {
            res.status(500).json({
                message: 'Creating Customer Failed!'
            })
        });
}

exports.updateCustomer = (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
        const url = req.protocol + '://' + req.get("host");
        imagePath = url + "/images/" + req.file.filename
    }
    const customer = new Customer({
        _id: req.params.id,
        name: req.body.name,
        address: req.body.address,
        imagePath: imagePath,
        contact: req.body.contact,
        gst: req.body.gst,
        currentPage: req.userData.userId
    });
    Customer.updateOne({ _id: req.params.id, creator: req.userData.userId }, customer).then(result => {
        if (result.n > 0) {
            res.status(200).json({ message: 'Update Successful!' });
        } else {
            res.status(401).json({ message: 'Not Authorized!' });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Couldn't Update Customer!"
        });
    });
}

exports.getCustomers = (req, res, next) => {
    const pageSize = +req.query.pageSize;
    const currentPage = +req.query.page;
    const customerQuery = Customer.find({ creator: req.userData.userId });
    let fetchCustomers;
    if (pageSize && currentPage) {
        customerQuery
            .skip(pageSize * (currentPage - 1))
            .limit(pageSize);
    }
    customerQuery
        .then(documents => {
            fetchCustomers = documents;
            return Customer.countDocuments();

        })
        .then(count => {
            res.status(200).json({
                message: 'Customer fetched successfully',
                customers: fetchCustomers,
                maxCustomers: count
            });
        }).catch(error => {
            res.status(500).json({
                message: "Fetching Customer Failed!"
            });
        });
}

exports.getCustomer = (req, res, next) => {
    Customer.findById(req.params.id).then(customer => {
        if (customer) {
            res.status(200).json(customer)
        } else {
            res.status(400).json('Customer not found!');
        }
    }).catch(error => {
        res.status(500).json({
            message: "Fetching Customer Failed!"
        });
    });
}

exports.deleteCustomer = (req, res, next) => {
    Customer.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
        if (result.n > 0) {
            res.status(200).json({ message: 'Customer Updated!!!' });
        } else {
            res.status(401).json({ message: 'Unauthorized!!!' });
        }
    }).catch(error => {
        res.status(500).json({
            message: "Fetching Customer Failed"
        });
    });
}
