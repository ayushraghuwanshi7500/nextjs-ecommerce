import initDB from '../../helpers/initDB';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
initDB();

export default async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(422).json({ error: 'Please add all fields' });
    } else {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res.status(200).json({ error: 'Invalid Credentials' });
      }
      const matched = await bcrypt.compare(password, user.password);
      if (!matched) {
        return res.status(200).json({ error: 'Invalid Credentials' });
      } else if (matched) {
        const token = jwt.sign(
          { userId: user._id },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: '7d'
          }
        );
        console.log(token);
        const { name, role, email } = user;
        res
          .status(201)
          .json({
            token: token,
            user: { name: name, role: role, email: email }
          });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
