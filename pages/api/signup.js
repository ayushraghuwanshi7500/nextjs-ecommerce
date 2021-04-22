import initDB from '../../helpers/initDB';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
initDB();

export default async (req, res) => {
  const { name, email, password, password2 } = req.body;
  try {
    if (!name || !email || !password || !password2) {
      return res.status(422).json({ error: 'Please add all fields' });
    } else if (password !== password2) {
      return res.status(422).json({ error: 'Password match failed' });
    } else if (password === password2) {
      const user = await User.findOne({ email: email });
      if (user) {
        return res.status(200).json({ error: 'User already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await new User({
        name: name,
        email: email,
        password: hashedPassword
      }).save();
      return res
        .status(200)
        .json({ user: newUser, message: 'signup successful as ' + name + '!' });
    }
  } catch (error) {
    console.log(error);
  }
};
