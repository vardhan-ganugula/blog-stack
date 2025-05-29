import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

const Blogcard = ({
  title = 'Blog Post',
  description = 'This is a sample description for the blog post.',
  imageUrl = 'https://placehold.co/600x400',
  date = '2023-10-01',
  tags,
  slug = '/to'
}) => {
  const navigate = useNavigate();
  let blogTags = [];
  if (tags.length > 0) {
    blogTags = tags.slice(0, 5);
  }
  console.log(slug)
  return (
    <div className='blog__card'
    
      onClick={() => navigate('/blog/' + slug)}
    >


        <div>
          <img className='blog__img' src={imageUrl || 'https://placehold.co/600x400'} alt={title} />
        </div>
        <div className='blog__content'>
          <h3 className='blog__title'>{title}</h3>
          <p className='blog__description'>{description}</p>
          <span className='blog__date'>{new Date(date).toLocaleDateString()}</span>
          <div className='blog__tags'>
            {blogTags.length > 0 && blogTags.map((tag, index) => (
              <span key={index} className='blog__tag'>{tag}</span>
            ))}
          </div>
        </div>

    </div>
  )
}

export default Blogcard