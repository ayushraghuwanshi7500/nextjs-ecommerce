import Head from 'next/head';
import Link from 'next/link';
import baseUrl from '../helpers/baseUrl';
export default function Home({ products }) {
  const productList = products.map((product) => (
    <div className='card pcard' key={product._id}>
      <div className='card-image'>
        <img
          src={product.mediaUrl}
          alt={product.name}
          width='200'
          height='200'
        />
        <span className='card-title'>{product.name}</span>
      </div>
      <div className='card-content'>
        <p>Rs. {product.price}</p>
      </div>
      <div className='card-action'>
        <Link href={`/product/${product._id}`}>
          <a>View Product</a>
        </Link>
      </div>
    </div>
  ));

  console.log(products);
  return <div className='root-card'>{productList}</div>;
}

export async function getStaticProps(context) {
  const res = await fetch(`${baseUrl}/api/products`);
  const products = await res.json();

  if (!products) {
    return {
      notFound: true
    };
  }

  return {
    props: { products } // will be passed to the page component as props
  };
}
