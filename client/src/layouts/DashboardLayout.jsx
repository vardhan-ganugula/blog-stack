import Sidebar from '../components/Sidebar'
import '../assets/css/dashboard.css'
import {useSelector} from 'react-redux'


const DashboardLayout = ({children}) => {
  const isLoading = useSelector(state => state.auth.isLoading);
  return (
    <main className='dashboard__main bg-img'>
      <section className='dashboard__section bg-img'>

        <div className='dashboard__sidebar'>
          <Sidebar />
        </div>
        <div className='dashboard__content'>
          {
            isLoading ? <div className="loading-spinner">Loading...</div> : children
          }
        </div>
      </section>
    </main>
  )
}

export default DashboardLayout