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
    required: true,
  },
},{
  timestamps: true,
  bufferTimeoutMS: 300000,
})

userSchema.virtual('id').get(function () {
  return this._id.toHexString();
});

// Ensure virtual fields are serialised.
userSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.password
  }
  
});

const User = mongoose.model('User', userSchema)

export default User

