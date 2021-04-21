import { useState, useRef } from 'react';
import baseUrl from '../helpers/baseUrl';
const create = () => {
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
  const onChange = (e) => {
    if (e.target.name === 'mediaUrl') {
      imagehandler(e);
      setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: { 'Content-type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const res2 = await res.json();
    console.log(res2);
    if (res2.error) {
      M.toast({ html: res2.error, classes: 'red' });
    }
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
      <div class='file-field input-field'>
        <div class='btn'>
          <span>File</span>
          <input
            name='mediaUrl'
            type='file'
            accept='image/*'
            onChange={onChange}
          />
        </div>
        <div class='file-path-wrapper'>
          <input
            class='file-path validate'
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

export default create;
