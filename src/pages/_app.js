import 'bootstrap/dist/css/bootstrap.min.css';
import './themes.scss';
import './index.scss';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;

// global styles / logic / structure