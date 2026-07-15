import User from '../../models/User.js';

export const createUser = async (userData) => {
  try {
    const newUser = await User.create(userData);
    const userObj = newUser.toObject();
    delete userObj.password;
    return userObj;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Duplicate email: A user with this email already exists.');
    }
    throw new Error(`Failed to create user: ${error.message}`);
  }
};

export const getUserByEmail = async (email, includePassword = false) => {
  try {
    let query = User.findOne({ email });
    if (!includePassword) {
      query = query.select('-password');
    }
    const user = await query.lean();
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    throw new Error(`Failed to retrieve user: ${error.message}`);
  }
};

export const getUserById = async (id) => {
  try {
    const user = await User.findById(id).select('-password').lean();
    if (!user) throw new Error('User not found');
    return user;
  } catch (error) {
    throw new Error(`Failed to retrieve user: ${error.message}`);
  }
};

export const updateUser = async (id, updateData) => {
  try {
    if (updateData.password) {
      delete updateData.password; 
    }
    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password').lean();
    
    if (!updatedUser) throw new Error('User not found');
    return updatedUser;
  } catch (error) {
    if (error.code === 11000) {
      throw new Error('Duplicate email: A user with this email already exists.');
    }
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

export const updateLastLogin = async (id) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id, 
      { lastLogin: new Date() }, 
      { new: true }
    ).select('-password').lean();
    
    if (!updatedUser) throw new Error('User not found');
    return updatedUser;
  } catch (error) {
    throw new Error(`Failed to update last login: ${error.message}`);
  }
};

export const deleteUser = async (id) => {
  try {
    const deletedUser = await User.findByIdAndDelete(id).select('-password').lean();
    if (!deletedUser) throw new Error('User not found');
    return deletedUser;
  } catch (error) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};
