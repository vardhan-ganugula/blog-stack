import '../assets/css/auth.css'
import {useSelector} from 'react-redux'
import Loading from '../components/Loading';
const AuthLayout = ({children}) => {
  const isLoading = useSelector(state => state.auth.isLoading);
  return (
    <main className='bg-img auth__layout'>

        {
          isLoading ? <Loading size='500px' /> : children
        }
        
    </main>
  )
}

export default AuthLayout