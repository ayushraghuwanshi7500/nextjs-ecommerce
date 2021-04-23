import initDB from '../../helpers/initDB';
import Stripe from 'stripe';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import Cart from '../../models/Cart';
import Order from '../../models/Order';

initDB();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

export default async (req, res) => {
  const { paymentInfo } = req.body;
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({ error: 'you must login' });
  }
  try {
    const { userId } = jwt.verify(authorization, process.env.JWT_SECRET_KEY);
    const cart = await Cart.findOne({ user: userId }).populate(
      'product.product'
    );
    const price = cart.product.reduce(
      (price, item) => item.product.price * Number(item.quantity) + price,
      0
    );
    const prevCustomer = await stripe.customers.list({
      email: paymentInfo.email
    });

    const isExistingCustomer = prevCustomer.data.length > 0;
    let newCustomer;
    if (!isExistingCustomer) {
      newCustomer = await stripe.customers.create({
        email: paymentInfo.email,
        source: paymentInfo.id
      });
    }
    const charge = await stripe.charges.create(
      {
        currency: 'INR',
        amount: price * 100,
        receipt_email: paymentInfo.email,
        customer: isExistingCustomer ? prevCustomer.data[0].id : newCustomer.id,
        description: `you purchase a product | ${paymentInfo.email}`
      },
      {
        idempotencyKey: uuidv4()
      }
    );
    await new Order({
      user: userId,
      email: paymentInfo.email,
      totalAmount: price,
      product: cart.product
    }).save();
    await Cart.findOneAndUpdate({ _id: cart._id }, { $set: { product: [] } });

    res.status(200).json({ message: 'payment was successful' });
  } catch (error) {
    console.log('this', error);
    return res.status(401).json({ error: 'error processing payment' });
  }
};
