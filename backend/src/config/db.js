const mongoose = require("mongoose");
const Property = require("../models/Property");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
    // TODO: Remove this in later - only for demo purposes
    // await seedMockData();
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
}

const seedMockData = async () => {
  try {
    await Property.deleteMany({});

    await Property.create({
      _id: "prop1",
      title: "2BHK Apartment - Andheri",
      city: "Mumbai",
      price: 12000000,

      location: {
        lat: 19.0760,
        lng: 72.8777
      },

      nearbyPlaces: [
  {
    type: "office",
    name: "Tech Park",
    distance: 12,
    travelTime: { car: 40 }
  },
  {
    type: "cafe",
    name: "Cafe Brew",
    distance: 1.5,
    travelTime: { car: 6 }
  },
  {
    type: "school",
    name: "ABC School",
    distance: 3,
    travelTime: { car: 10 }
  },
  {
    type: "hospital",
    name: "City Hospital",
    distance: 4,
    travelTime: { car: 12 }
  },
  {
    type: "airport",
    name: "International Airport",
    distance: 25,
    travelTime: { car: 60 }
  },

  {
    type: "college",
    name: "Engineering College",
    distance: 8,
    travelTime: { car: 15 }
  },
  {
    type: "transport",
    name: "Metro Station",
    distance: 2,
    travelTime: { car: 5 }
  },
  {
    type: "park",
    name: "Central Park",
    distance: 3,
    travelTime: { car: 8 }
  }
]
    });

    console.log("Mock property data seeded");
  } catch (err) {
    console.error("Seeding error:", err);
  }
};

module.exports = { connectDB };