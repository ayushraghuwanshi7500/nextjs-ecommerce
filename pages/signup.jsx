import { useState } from 'react';
import Link from 'next/link';
import baseUrl from '../helpers/baseUrl';
import cookie from 'js-cookie';
import { useRouter } from 'next/router';
const signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: ''
  });
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${baseUrl}/api/signup`, {
      method: 'POST',
      headers: {
        'Content-type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    const res2 = await res.json();
    console.log(res2);
    if (res2.error) {
      M.toast({ html: res2.error, classes: 'red' });
    } else {
      console.log(res2.token);
      cookie.set('token', res2.token);
      cookie.set('user', res2.user);
      router.push('/account');
      M.toast({ html: res2.message, classes: 'green' });
    }
  };
  return (
    <div className='container card authcard center-align'>
      <h3>SignUp</h3>
      <form onSubmit={(e) => handleSubmit(e)}>
        <input
          type='text'
          placeholder='name'
          name='name'
          value={formData.name}
          onChange={onChange}
        />
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
        <input
          type='password'
          placeholder='confirm password'
          name='password2'
          value={formData.password2}
          onChange={onChange}
        />
        <button
          className='btn waves-effect waves-light  #1565c0 blue darken-3'
          type='submit'
        >
          Sign Up
          <i className='material-icons right'>forward</i>
        </button>
      </form>
      <button className='btn waves-effect waves-light  green' type='button'>
        <Link href='/login'>
          <a> Already have an account? Login!</a>
        </Link>
      </button>
    </div>
  );
};

export default signup;
