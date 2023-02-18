import Layout from '../components/Layout'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'antd/dist/antd.css';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/globals.css'
import { wrapper } from '../store/store'
function MyApp({ Component, pageProps }) {

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
  
}

export default wrapper.withRedux(MyApp)
