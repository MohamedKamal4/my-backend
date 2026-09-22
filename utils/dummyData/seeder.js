const fs = require('fs');
// require('colors');
const dotenv = require('dotenv');
const Product = require('../../models/products_model');
const dbConnection = require('../../config/connect_dataBase');

dotenv.config({ path: '../../.env' });

// connect to DB
dbConnection();

// Read data
const rawProducts = fs.readFileSync('./products.json', 'utf-8');
const products = JSON.parse(rawProducts.replace(/^\uFEFF/, ''));

// Insert data into DB
const insertData = async () => {
  try {
    await Product.create(products);

    console.log('Data Inserted');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// Delete data from DB
const destroyData = async () => {
  try {
    await Product.deleteMany();
    console.log('Data Destroyed');
    process.exit();
  } catch (error) {
    console.log(error);
  }
};

// node seeder.js -d
if (process.argv[2] === '-i') {
  insertData();
} else if (process.argv[2] === '-d') {
  destroyData();
}