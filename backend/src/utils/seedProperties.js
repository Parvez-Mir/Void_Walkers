import mongoose from "mongoose";
import dotenv from "dotenv";
import { Property } from "../models/property.model.js";
import { generateMockProperties } from "./property-seed.helper.js";

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hackathonDB");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  try {
    await connectDB();
    
    console.log("Clearing existing properties...");
    await Property.deleteMany({});
    console.log("Existing properties deleted.");

    console.log("Generating mock properties...");
    const mockData = generateMockProperties({ count: 1000 });

    console.log("Inserting properties into the database...");
    await Property.insertMany(mockData);
    
    console.log("Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error(`Error importing data: ${error.message}`);
    process.exit(1);
  }
};

importData();
