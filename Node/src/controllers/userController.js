const User = require('../models/userModel');

class UserController {
  async createUser(req, res) {
    const { name, email, password } = req.body;
    try {
      const newUser = new User({ name, email, password });
      await newUser.save();
      res.status(201).json(newUser);
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async getUserById(req, res) {
    const { id } = req.params;
    try {
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async updateUser(req, res) {
    const { id } = req.params;
    const { name, email, password } = req.body;
    try {
      const updatedUser = await User.findByIdAndUpdate(id, { name, email, password }, { new: true });
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(updatedUser);
    } catch (error) {
      console.error('Error updating user:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }

  async deleteUser(req, res) {
    const { id } = req.params;
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(204).end();
    } catch (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Server error' });
    }
  }
}

module.exports = new UserController();
