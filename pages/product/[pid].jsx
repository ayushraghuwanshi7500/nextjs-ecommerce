import baseUrl from '../../helpers/baseUrl';
import { useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
const product = ({ product }) => {
  const cookie = parseCookies();
  // console.log(cookie);
  const user = cookie.user ? JSON.parse(cookie.user) : '';
  const router = useRouter();
  const modalRef = useRef(null);
  useEffect(() => {
    M.Modal.init(modalRef.current);
  }, []);
  console.log(product);
  const getModal = () => {
    return (
      <div id='modal1' className='modal' ref={modalRef}>
        <div className='modal-content'>
          <h4>{product.title}</h4>
          <p>Are you sure you want to delete this product?</p>
        </div>
        <div className='modal-footer'>
          <button className='btn waves-effect waves-light #c62828 red darken-3'>
            Cancel
          </button>
          <button
            className='btn waves-effect waves-light #1565c0 blue darken-3'
            onClick={() => deleteProduct()}
          >
            Yes
          </button>
        </div>
      </div>
    );
  };
  const deleteProduct = async () => {
    const res = await fetch(`${baseUrl}/api/product/${product._id}`, {
      method: 'DELETE'
    });

    await res.json();
    router.push('/');
  };
  return (
    <div className='container center-align'>
      <h3>{product.name}</h3>
      <img style={{ width: '30%' }} src={product.mediaUrl} alt='' />
      <h6>Rs. {product.price}</h6>
      <p>{product.description}</p>
      <input
        type='number'
        style={{ width: '30%' }}
        min='1'
        placeholder='Quantity'
      />
      <button className='btn waves-effect waves-light  #1565c0 blue darken-3'>
        Add
        <i className='material-icons right'>add</i>
      </button>
      {user.role !== 'user' && (
        <button
          data-target='modal1'
          className='btn modal-trigger waves-effect waves-light #c62828 red darken-3'
        >
          Delete
          <i className='material-icons right'>delete</i>
        </button>
      )}
      {getModal()}
    </div>
  );
};
export async function getStaticPaths() {
  const res = await fetch('http://localhost:3000/api/products');
  const products = await res.json();
  console.log('mine', products);
  const paths = products.map((product) => ({
    params: { pid: product._id }
  }));
  console.log(paths);
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  console.log('hello from static');
  console.log(params);
  const res = await fetch(`${baseUrl}/api/product/${params.pid}`);
  const product = await res.json();
  return { props: { product } };
}

export default product;
