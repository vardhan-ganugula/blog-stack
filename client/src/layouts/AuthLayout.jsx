import '../assets/css/auth.css'
import {useSelector} from 'react-redux'
const AuthLayout = ({children}) => {
  const isLoading = useSelector(state => state.auth.isLoading);
  return (
    <main className='bg-img auth__layout'>

        {
          isLoading ? "Loading..." : children
        }
        
    </main>
  )
}

export default AuthLayout