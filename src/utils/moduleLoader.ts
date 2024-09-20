// utils/modelLoader.ts
import mongoose from 'mongoose';

export const loadModel = async (modelName: string) => {
  try {
    // If the model is already registered with Mongoose, return it
    if (mongoose.models[modelName]) {
      return mongoose.models[modelName];
    }

    // Dynamically import the model
    const { default: model } = await import(
      `../models/v1/Product/${modelName}`
    );

    return model;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(
        `Model ${modelName} could not be loaded: ${error.message}`
      );
    } else {
      throw new Error(`Model ${modelName} could not be loaded: Unknown error`);
    }
  }
};
