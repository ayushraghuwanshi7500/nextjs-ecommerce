import Head from 'next/head';
import Link from 'next/link';
import baseUrl from '../helpers/baseUrl';
export default function Home({ products }) {
  const productList = products.map((product) => (
    <div className='row' key={product._id}>
      <div className='col s12 m7'>
        <div className='card'>
          <div className='card-image'>
            <img src={product.mediaUrl} alt={product.name} />
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
