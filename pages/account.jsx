import React from 'react';
import { parseCookies } from 'nookies';
const account = () => {
  return <div>Accout page</div>;
};

export async function getServerSideProps(context) {
  const { token } = parseCookies(context);
  if (!token) {
    const { res } = context;
    res.writeHead(302, { Location: '/login' });
    res.end();
  }

  return {
    props: {}
  };
}

export default account;
