import React from 'react';
import baseUrl from '../helpers/baseUrl';
import { parseCookies } from 'nookies';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
const cart = ({ error, product }) => {
  const router = useRouter();
  if (error) {
    M.toast({ html: error, classes: 'red' });
    cookie.remove('token');
    cookie.remove('user');
    router.push('/login');
  }
  return (
    <div>
      <h1>My Cart</h1>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { token } = parseCookies(context);
  if (!token) {
    return { props: { product: [] } };
  }

  console.log('token', token);
  const res = await fetch(`${baseUrl}/api/cart`, {
    headers: {
      Authorization: token
    }
  });
  const product = await res.json();
  console.log('product', product);

  if (product.error) {
    return {
      props: {
        error: product.error
      }
    };
  }

  return { props: { product: product } };
}

export default cart;
