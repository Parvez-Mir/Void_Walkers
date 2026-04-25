import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "../src/utils/db.helper.js";
import { Property } from "../src/models/property.model.js";
import { generateMockProperties } from "../src/utils/property-seed.helper.js";

dotenv.config();

const countArg = process.argv.find((arg) => arg.startsWith("--count="));
const seedArg = process.argv.find((arg) => arg.startsWith("--seed="));
const reset = process.argv.includes("--reset");
const count = countArg ? Number(countArg.split("=")[1]) : 1000;
const seed = seedArg ? seedArg.split("=")[1] : "void-walkers-ahmedabad";

const run = async () => {
  await connectDB();

  if (reset) {
    await Property.deleteMany({});
  }

  const payload = generateMockProperties({ count, seed });
  await Property.bulkWrite(
    payload.map((property) => ({
      updateOne: {
        filter: { propertyCode: property.propertyCode },
        update: { $set: property },
        upsert: true
      }
    }))
  );

  const total = await Property.countDocuments();
  console.log(`Seeded or updated ${payload.length} properties. Total documents: ${total}`);
};

run()
  .catch((error) => {
    console.error("Property seeding failed", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.connection.close();
  });
