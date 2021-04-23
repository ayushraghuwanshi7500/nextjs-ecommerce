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
      await fetchUsers(req, res);
      break;
    case 'PUT':
      await toggleRoleChange(req, res);
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

const fetchUsers = Authenticated(async (req, res) => {
  const users = await User.find({ _id: { $ne: req.userId } });
  console.log(users);
  res.status(200).json(users);
});

const toggleRoleChange = Authenticated(async (req, res) => {
  const { uid, role } = req.body;
  console.log(uid, role);
  const newRole = role === 'user' ? 'admin' : 'user';
  const user = await User.findOneAndUpdate(
    { _id: uid },
    { role: newRole },
    { new: true }
  );
  console.log(user);
  const users = await User.find({ _id: { $ne: req.userId } });
  return res.status(200).json(users);
});
