import React from 'react';
import { parseCookies } from 'nookies';
import baseUrl from '../helpers/baseUrl';
const account = ({ allOrders }) => {
  const cookie = parseCookies();
  console.log(allOrders);
  const user = cookie.user ? JSON.parse(cookie.user) : '';
  return (
    <div className='container'>
      <div className='center-align'>
        <h4>{user.name}</h4>
        <h4>{user.email}</h4>
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
      'Content-Type': 'application/json',
      Authorization: token
    }
  });
  const orders = await res.json();
  console.log('orders from gssp');
  console.log(orders.orders);
  const allOrders = orders.orders;
  return {
    props: {
      allOrders: allOrders
    }
  };
}

export default account;
