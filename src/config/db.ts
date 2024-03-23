import mongoose from 'mongoose';

export const connectToMongoDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI environment variable not defined');
  }

  console.log(process.env.MONGO_URI);

  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log(err);
  }
};
