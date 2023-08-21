import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: [true,'This Email is already taken']
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },

  updatedAt: {
    type: Date,
    default: Date.now
  }
})

userSchema.pre('findOneAndUpdate', async function(next) {
  const docToUpdate = await this.model.findOne(this.getQuery());
  if (docToUpdate) {
    docToUpdate.updatedAt = new Date();
    await docToUpdate.save();
    this.select('-password'); 
  }
  next();
});

userSchema.pre('find', function() {
  this.select('-password'); 
});

const User = mongoose.model('User', userSchema)

export default User

