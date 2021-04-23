import { useState, useEffect, useRef } from 'react';
import baseUrl from '../helpers/baseUrl';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
const create = () => {
  const router = useRouter();
  const [img, setImage] = useState('');
  const imagehandler = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setImage(reader.result);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    mediaUrl: ''
  });
  useEffect(() => {
    console.log(formData);
  }, [formData]);
  const onChange = (e) => {
    if (e.target.name === 'mediaUrl') {
      imagehandler(e);
      imageUpload(e);
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch(`${baseUrl}/api/products`, {
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
      M.toast({ html: 'Product upload Successful!', classes: 'green' });
      router.replace('/');
    }
  };
  const imageUpload = async (e) => {
    const data = new FormData();
    const mediaUrl = e.target.files[0];
    data.append('file', mediaUrl);
    data.append('upload_preset', 'mystore');
    data.append('cloud_name', 'ayushraghuwanshi');
    const res = await fetch(
      'https://api.cloudinary.com/v1_1/ayushraghuwanshi/image/upload',
      {
        method: 'POST',

        body: data
      }
    );
    const res2 = await res.json();
    console.log(res2);
    setFormData({ ...formData, mediaUrl: await res2.url });
    return res2.url;
  };
  return (
    <form className='container' onSubmit={(e) => handleSubmit(e)}>
      <input
        name='name'
        value={formData.name}
        placeholder='product name'
        type='text'
        onChange={onChange}
      />
      <input
        name='price'
        value={formData.price}
        placeholder='product price'
        type='number'
        min='1'
        onChange={onChange}
      />
      <textarea
        name='description'
        value={formData.description}
        placeholder='product description'
        type='text'
        min='1'
        onChange={onChange}
      />
      <div className='file-field input-field'>
        <div className='btn'>
          <span>File</span>
          <input
            name='mediaUrl'
            type='file'
            accept='image/*'
            onChange={onChange}
          />
        </div>
        <div className='file-path-wrapper'>
          <input
            className='file-path validate'
            type='text'
            placeholder='Upload a file'
          />
        </div>
      </div>
      {img && (
        <img
          className='responsive-img'
          src={img}
          height='150vh'
          width='250vw'
        />
      )}{' '}
      <br />
      <button
        className='btn waves-effect waves-light  #1565c0 blue darken-3'
        type='submit'
      >
        Create
        <i className='material-icons right'>create</i>
      </button>
    </form>
  );
};

export async function getServerSideProps(context) {
  const cookie = parseCookies(context);
  const user = cookie.user ? JSON.parse(cookie.user) : '';
  if (user.role != 'admin' && user.role != 'root') {
    const { res } = context;
    res.writeHead(302, { Location: '/' });
    res.end();
  }

  return {
    props: {}
  };
}

export default create;
