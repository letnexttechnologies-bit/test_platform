import mongoose from "mongoose";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected Successfully...🥳");
  } catch (error) {
    console.error("Failed to connect...👎", error.message);
    process.exit(1); // stop server if DB connection fails
  }
};

export default connectDb;
