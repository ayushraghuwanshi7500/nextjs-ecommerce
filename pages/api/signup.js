import initDB from '../../helpers/initDB';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import Cart from '../../models/Cart';
import jwt from 'jsonwebtoken';
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
      await new Cart({
        product: [],
        user: newUser._id
      }).save();
      const token = jwt.sign(
        { userId: newUser._id },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: '7d'
        }
      );
      return res.status(200).json({
        token: token,
        user: newUser,
        message: 'signup successful as ' + name + '!'
      });
    }
  } catch (error) {
    console.log(error);
  }
};
