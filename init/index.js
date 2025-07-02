const mongoose = require('mongoose');
const initdata =require("./data.js");
const Listing = require('../models/listing.js');


main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/excursia');
    console.log("Connected to MongoDB");
}

const initDB= async()=>{
    await Listing.deleteMany({});
    initdata.data= initdata.data.map((obj)=> ({...obj,owner:'68621dfe40201bc443944f0b'}));
    await Listing.insertMany(initdata.data);
}

initDB();
