import Link from 'next/link';
import { useRouter } from 'next/router';
const NavBar = () => {
  const router = useRouter();
  const isActive = (route) => {
    if (route === router.pathname) {
      return 'active';
    } else {
      return '';
    }
  };
  return (
    <nav>
      <div className='nav-wrapper #1565c0 blue darken-3'>
        <Link href='/'>
          <a className='brand-logo left'>Home</a>
        </Link>
        <ul id='nav-mobile' className='right'>
          <li className={isActive('/login')}>
            <Link href='/login'>
              <a>Login</a>
            </Link>
          </li>
          <li className={isActive('/signup')}>
            <Link href='/signup'>
              <a>Sign Up</a>
            </Link>
          </li>
          <li className={isActive('/create')}>
            <Link href='/create'>
              <a>Create</a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
