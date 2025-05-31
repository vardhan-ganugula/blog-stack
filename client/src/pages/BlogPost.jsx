import React from 'react'
import Loading from '../components/Loading'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import '../assets/css/blog.css'
const BlogPost = () => {

  const { slug } = useParams()
  const blogs = useSelector(state => state.blog.blogPosts);
  const isLoading = useSelector(state => state.blog.isLoading)
  const blog = blogs.filter(val => val.slug == slug)[0]
  return (
    <main>
      <div className='blog__article__container'>
        {
        isLoading ? <Loading size='200px' /> : (
          <article className='blog__article'>
            <h1 className='blog__title'>{blog.title}</h1>
            <img src={blog.imageUrl} alt='testing' className='blog_feature_image' />
            <div className='blog__content'>
              <div className='blog__content__inner' dangerouslySetInnerHTML={{__html: blog.content}}>

              </div>
            </div>
            <div className='blog__tags'>
              {
                blog.tags.length > 0 && blog.tags.map((tag, idx) => <span key={idx} className='blog__tag'>{tag}</span>)
              }
            </div>
          </article>
        )
      }
      </div>
    </main>
  )
}

export default BlogPost