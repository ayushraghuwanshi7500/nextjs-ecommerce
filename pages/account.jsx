import React, { useEffect, useRef } from 'react';
import { parseCookies } from 'nookies';
import Link from 'next/link';
import baseUrl from '../helpers/baseUrl';
import UserRoles from '../components/UserRoles';
const account = ({ orders }) => {
  const orderCard = useRef(null);
  const cookie = parseCookies();
  console.log(orders);
  const user = cookie.user ? JSON.parse(cookie.user) : '';
  useEffect(() => {
    M.Collapsible.init(orderCard.current);
  }, []);
  const orderHistory = () => {
    return (
      <ul className='collapsible' ref={orderCard}>
        {orders.map((item) => {
          return (
            <li>
              <div className='collapsible-header'>
                <i className='material-icons'>folder</i>
                {item.createdAt}
              </div>
              <div className='collapsible-body'>
                <h5> Total Amount Rs. {item.totalAmount} </h5>
                {item.product.map((x, index) => {
                  return (
                    <>
                      {' '}
                      <h6>
                        {' '}
                        {index + 1}) {x.product.name} X {x.quantity} X Rs.{' '}
                        {x.product.price}
                      </h6>
                      <img src={x.product.mediaUrl} width='200' height='200' />
                    </>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    );
  };
  return (
    <div className='container'>
      <div className='center-align'>
        <h4>Name: {user.name}</h4>
        <h4>Email: {user.email}</h4>
        <h4 style={{ textTransform: 'capitalize' }}>Role: {user.role}</h4>
        <h4> Order History </h4>
        {orders.length > 0 && orderHistory()}
        {orders.length === 0 && (
          <h5>
            You have not purchased Anything. <Link href='/'>Shop Now!!</Link>{' '}
          </h5>
        )}
        {user.role === 'root' && <UserRoles />}
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { token } = parseCookies(context);
  if (!token) {
    const { res } = context;
    res.writeHead(302, { Location: '/login' });
    res.end();
  }
  const res = await fetch(`${baseUrl}/api/order`, {
    method: 'GET',
    headers: {
      Authorization: token
    }
  });
  const orders = await res.json();
  console.log('orders from gssp');
  console.log(orders);
  return {
    props: {
      orders: orders
    }
  };
}

export default account;
