import initDB from '../../../helpers/initDB';
import Product from '../../../models/Product';

initDB();

export default async (req, res) => {
  const { pid } = req.query;
  switch (req.method) {
    case 'GET':
      console.log('get log');

      const product = await Product.findOne({ _id: pid });
      res.status(200).json(product);
      break;
    case 'DELETE':
      await Product.findOneAndDelete({ _id: pid });
      res.status(200).json({ message: 'Product Deleted successfully' });
      break;
  }
};
