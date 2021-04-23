import React, { useState } from 'react';
import baseUrl from '../helpers/baseUrl';
import { parseCookies } from 'nookies';
import cookie from 'js-cookie';
import Link from 'next/link';
import { useRouter } from 'next/router';
import StripeCheckout from 'react-stripe-checkout';

const cart = ({ error, product }) => {
  const [cart, setCart] = useState(product);
  const cookie = parseCookies();
  const token = cookie.token;
  const user = cookie.user;
  const router = useRouter();
  if (error) {
    M.toast({ html: error, classes: 'red' });
    cookie.remove('token');
    cookie.remove('user');
    router.push('/login');
  }
  const handleRemove = async (pid) => {
    const res = await fetch(`${baseUrl}/api/cart`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({
        productId: pid
      })
    });
    const updatedCart = await res.json();
    setCart(updatedCart);
    console.log(updatedCart);
  };
  const getCartCount = () => {
    return cart.reduce((quantity, item) => Number(item.quantity) + quantity, 0);
  };
  const totalPrice = () => {
    return cart.reduce(
      (price, item) => item.product.price * Number(item.quantity) + price,
      0
    );
  };
  const CartItems = () => {
    return (
      <>
        {cart.map((item) => {
          return (
            <div style={{ display: 'flex', margin: '20px' }}>
              <img
                src={item.product.mediaUrl}
                alt={item.product.name}
                width='30%'
              />
              <div style={{ marginLeft: '20px' }}>
                <h6> {item.product.name} </h6>
                <h6>
                  Rs. {item.product.price} x {item.quantity}
                </h6>
                <p> {item.product.description} </p>
                <button
                  onClick={() => handleRemove(item.product._id)}
                  className='btn red'
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </>
    );
  };
  const handleCheckout = async (paymentInfo) => {
    console.log(paymentInfo);
    const res = await fetch(`${baseUrl}/api/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify({ paymentInfo: paymentInfo })
    });

    const res2 = await res.json();
    if (res2.message) {
      router.reload();
    }
    console.log(res2);
  };
  return (
    <div>
      {!token ? (
        <>
          <h1>Please login to view your cart</h1>
          <Link href='/login'>
            <a>
              <h1> Login </h1>
            </a>
          </Link>
        </>
      ) : (
        <div className='container'>
          {cart.length > 0 ? (
            <>
              <h1>My Cart</h1>

              <CartItems />
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <h4> Total Price: Rs. {totalPrice()} </h4>
                </div>
                <div>
                  <h4>Total Product in Cart: {getCartCount()} </h4>
                </div>
                <div style={{ marginTop: 20 }}>
                  <StripeCheckout
                    name='My Store'
                    amount={totalPrice() * 100}
                    image={
                      product.length > 0 ? product[0].product.mediaUrl : ''
                    }
                    currency='INR'
                    shippingAddress={true}
                    billingAddress={true}
                    zipCode={true}
                    stripeKey='pk_test_51IjHsVSBe9Ej1wf7KmXDzo8P8iVbK3697Z64LsSHBRAnHg0m6hRbetLH9zpFrwSzdz6oIJwW0bpQKpZ1UOHRxuKQ00wEjQ5epf'
                    token={(paymentInfo) => handleCheckout(paymentInfo)}
                  >
                    <button className='btn green'>Checkout</button>
                  </StripeCheckout>
                </div>
              </div>
            </>
          ) : (
            <h1>Cart is empty. Add products to cart.</h1>
          )}
        </div>
      )}
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
