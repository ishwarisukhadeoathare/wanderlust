const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  await Listing.deleteMany({});
  
  // Map the data and ensure that ObjectId is created with `new`
  const dataWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: new mongoose.Types.ObjectId("67693f38e990dd3d73869c79")  // Instantiate ObjectId properly
  }));
  
  await Listing.insertMany(dataWithOwner);
  console.log("data was initialized");
};

initDB();

