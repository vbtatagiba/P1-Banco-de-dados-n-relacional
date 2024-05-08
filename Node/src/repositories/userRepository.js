const User = require('../models/userModel');

class UserRepository {
  async createUser(name, email, password) {
    try {
      const user = new User({ name, email, password });
      await user.save();
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getUserById(id) {
    try {
      return await User.findById(id);
    } catch (error) {
      throw error;
    }
  }

  async updateUser(id, newData) {
    try {
      const user = await User.findByIdAndUpdate(id, newData, { new: true });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      return await User.findByIdAndDelete(id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserRepository();
