import initDB from '../../helpers/initDB';
import Product from '../../models/Product';

initDB();
export default async (req, res) => {
  switch (req.method) {
    case 'GET':
      const products = await Product.find();
      res.status(200).json(products);
      break;
    case 'POST':
      const { name, price, description, mediaUrl } = req.body;
      console.log(name, price, description);
      if (!name || !price || !description || !mediaUrl) {
        return res.status(422).json({ error: 'please add all the fields' });
      }
      const product = await new Product({
        name: name,
        price: price,
        description: description,
        mediaUrl: mediaUrl
      }).save();
      res.status(201).res.json(product);
      break;
  }
};
