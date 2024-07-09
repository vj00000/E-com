const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Customer } = require('../models/customer'); // Assuming your Customer model is in models/customer.js

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);
    const newCustomer = new Customer({
      name,
      email,
      password: hashedPassword,
    });
    

    await newCustomer.save();
    const payload = { customerId: newCustomer._id };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '3600s' }); // Token expires in 1 hour
    res.send({"a":req.body.name});
    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const customer = await Customer.findOne({ email:email });
    if (!customer) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    
    // Validate password
    const isMatch = await bcryptjs.compare(password, customer.password);
    // res.send(customer);
    res.send({"a":isMatch})
    return ;
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create and send token
    const payload = { customerId: customer._id };
    const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: '3600s' }); // Token expires in 1 hour

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;