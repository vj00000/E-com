const express = require('express');
const bodyParser = require('body-parser');
const app = express();
require('dotenv').config()
const connectDB = require('./db');
connectDB();

app.use(bodyParser.json());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// app.get('/',(req,res)=>{res.send({'Hello':"sdad"})}) //test
app.use('/api/auth', require('./routes/auth'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/products', require('./routes/products')); 


app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT}`);
});