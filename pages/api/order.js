import initDB from '../../helpers/initDB';
import User from '../../models/User';
import bcrypt from 'bcryptjs';
import Cart from '../../models/Cart';
import jwt from 'jsonwebtoken';
import Order from '../../models/Order';
initDB();

export default async (req, res) => {
  switch (req.method) {
    case 'GET':
      await fetchOrders(req, res);
      break;
  }
};

function Authenticated(icomponent) {
  return (req, res) => {
    const { authorization } = req.headers;
    if (!authorization) {
      return res.status(401).json({ error: 'you must login' });
    }
    try {
      const { userId } = jwt.verify(authorization, process.env.JWT_SECRET_KEY);
      req.userId = userId;
      return icomponent(req, res);
    } catch (error) {
      console.log('this', error);
      return res.status(401).json({ error: 'you must login error' });
    }
  };
}

const fetchOrders = Authenticated(async (req, res) => {
  console.log(req.userId);
  const orders = await Order.findOne({ user: req.userId });
  console.log(orders);
  res.status(200).json({ orders: orders });
});
