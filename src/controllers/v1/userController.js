
import bcrypt from 'bcrypt'
import User from "../../models/v1/userModel.js";

export const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const users = await User.find(query).skip(startIndex).limit(limit).lean();

    const total = await User.countDocuments(query);

    let nextPage = page + 1;
    if (nextPage * limit > total) {
      nextPage = null;
    }

    res.json({
      data: users,
      currentPage: page,
      nextPage: nextPage,
      totalPages: Math.ceil(total / limit)
    });
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
    };
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    userPayload.password = await bcrypt.hash(req.body.password, salt);

    const user = new User(userPayload);
    await user.save();

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' }); 
  }
}

export const updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      {
        name: req.body.name,
        email: req.body.email,
       
      },
      { new: true}
    );



    if (!user) {
     return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
    
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
}

