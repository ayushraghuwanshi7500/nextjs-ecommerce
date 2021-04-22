import { useState } from 'react';
import Link from 'next/link';
import baseUrl from '../helpers/baseUrl';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
const login = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    const res = await fetch(`${baseUrl}/api/login`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const res2 = await res.json();
    if (res2.error) {
      M.toast({ html: res2.error, classes: 'red' });
    } else {
      console.log(res2.token);
      cookie.set('token', res2.token);
      cookie.set('user', res2.user);
      router.push('/account');
      M.toast({ html: 'login success', classes: 'green' });
    }
  };
  return (
    <div className='container card authcard center-align'>
      <h1>Login</h1>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type='email'
          placeholder='email'
          name='email'
          value={formData.email}
          onChange={onChange}
        />
        <input
          type='password'
          placeholder='password'
          name='password'
          value={formData.password}
          onChange={onChange}
        />

        <button
          className='btn waves-effect waves-light  #1565c0 blue darken-3'
          type='submit'
        >
          Login
          <i className='material-icons right'>forward</i>
        </button>
      </form>
      <button className='btn waves-effect waves-light  green' type='button'>
        <Link href='/signup'>
          <a> Don't have an accout? Sign Up! </a>
        </Link>
      </button>
    </div>
  );
};

export default login;
