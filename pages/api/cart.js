import initDB from '../../helpers/initDB';
import Cart from '../../models/Cart';

import jwt from 'jsonwebtoken';
initDB();

export default async (req, res) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'you must login' });
  }
  try {
    const { userId } = jwt.verify(authorization, process.env.JWT_SECRET_KEY);
    console.log('user', userId);
    const cart = await Cart.findOne({ user: userId });
    console.log('this', cart.product);
    res.status(200).json(cart.product);
  } catch (error) {
    console.log('this', error);
    return res.status(401).json({ error: 'you must login error' });
  }
};
