import initDB from '../../helpers/initDB';
import Cart from '../../models/Cart';

import jwt from 'jsonwebtoken';
initDB();

export default async (req, res) => {
  switch (req.method) {
    case 'GET':
      await fetchUserCart(req, res);
      break;
    case 'PUT':
      await addToCart(req, res);
      break;
  }
};

// HOC

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

const fetchUserCart = Authenticated(async (req, res) => {
  const cart = await Cart.findOne({ user: req.userId });
  res.status(200).json(cart.product);
});

const addToCart = Authenticated(async (req, res) => {
  const { product, quantity } = req.body;
  const userId = req.userId;
  const cart = await Cart.findOne({ user: userId });
  const checkIfExist = cart.product.some(
    (pdoc) => product === pdoc.product.toString()
  );
  if (checkIfExist) {
    await Cart.findOneAndUpdate(
      { _id: cart._id, 'product.product': product },
      { $inc: { 'product.$.quantity': quantity } }
    );
  } else {
    const newProduct = { quantity: quantity, product: product };
    await Cart.findOneAndUpdate(
      { _id: cart._id },
      { $push: { product: newProduct } }
    );
  }
  res.status(200).json({ message: 'product added to cart' });
  console.log(product, quantity, cart);
});
