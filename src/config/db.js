import mongoose from 'mongoose';

export const connectToMongoDB = async (app) => {
  console.log(process.env.MONGO_URI);
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err);
  }
};
