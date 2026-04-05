const mongoose = require('mongoose');
const passport = require('passport');
const User = mongoose.model('User');

const register = async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const user = new User({ name, email });
    user.setPassword(password);
    await user.save();

    const token = user.generateJwt();
    return res.status(200).json({ token });
  } catch (err) {
    return res.status(400).json(err);
  }
};

const login = (req, res) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return res.status(500).json(err);
    if (!user) return res.status(401).json(info);

    const token = user.generateJwt();
    return res.status(200).json({ token });
  })(req, res);
};

module.exports = { register, login };