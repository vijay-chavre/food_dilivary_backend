
import User from "../../models/v1/userModel.js";


export const getUsers = async (req, res) => {
  try {
    const users = await User.find().lean();
    res.json(users); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
}
export const createUser = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const userPayload = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    };
    
    const user = new User(userPayload);
    const resp = await user.save();

    console.log(resp);
    res.status(201).json(resp);

  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
}