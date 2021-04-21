import initDB from '../../helpers/initDB';
import Product from '../../models/Product';

initDB();
export default async (req, res) => {
  const products = await Product.find();
  res.status(200).json(products);
};
