import { useState } from 'react'
import '../assets/css/blog.css'
import Blogcard from '../components/Blogcard'
import {useSelector, useDispatch} from 'react-redux';

const Blogpage = () => {
  const blogdata = useSelector(state => state.blog.blogPosts)
  const [currentPage, setCurrentPage] = useState(1); 
  const postsPerPage = 5;

  const indexOfLastPost = currentPage * postsPerPage;

  const currentPosts = blogdata.slice(0,indexOfLastPost);
  const handleLoadMore = () => {
    setCurrentPage(prevPage => prevPage + 1);
  }



  return (
    <main className='blog__main'>

      <section className='blog__section'>
        {
          currentPosts.map((blog, index) => (
            <Blogcard key={blog._id} title={blog.title} description={blog.description}
             imageUrl={blog.imageUrl} date={blog.date} tags={blog.tags} slug={blog.slug} />
          ))
        }
        {
          currentPosts.length === 0 && <div className='blog__empty'>No blogs available</div>
        }

        <button className='blog__loadmore' onClick={handleLoadMore}
        
          disabled={indexOfLastPost >= blogdata.length}>
          Load More
        </button>
      </section>
    </main>
  )
}

export default Blogpage