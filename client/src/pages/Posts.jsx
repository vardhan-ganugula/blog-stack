import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import { postSchema } from '../schema/posts.schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IoClose } from "react-icons/io5";
import Loading from '../components/Loading'
const TextEditor = React.lazy(() => import('../components/TextEditor'))
import axios from '../utils/Axios';


const Posts = () => {
  const { register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting } } = useForm({
      resolver: zodResolver(postSchema),
      defaultValues: {
        title: '',
        description: '',
        content: '',
        tags: '',
        image: null
      }
    });
  const [nodification, setNotification] = React.useState({
    type: '',
    message: ''
  });
  const formRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [tags, setTags] = React.useState([]);

  const handleSaveDraft = (data) => {
    console.log('Draft saved:', data);
    setNotification({
      type: 'error',
      message: 'Draft saved successfully!'
    });
    reset()
  }

  const handleUploadPost = async (data) => {
    data.image = imgSrc;
    data.tags = JSON.stringify(tags);
    try {
      const response = await axios.post('/blogs/publish', data)
      alert(response.data)
    } catch (error) {
      console.error('Error uploading post:', error);
      setNotification({
        type: 'error',
        message: 'Failed to upload post. Please try again.'
      });
    }
  }

  const handleSetImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImgSrc(reader.result);
        setValue('image', file);
      };
      reader.readAsDataURL(file);
    } else {
      setImgSrc(null);
      setValue('image', null);
    }
  }

  const handleTagsChange = (e) => {
    const value = e.target.value;
    setValue('tags', value);

    if (value.includes(',')) {
      const newTags = [...tags, ...value.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag)
        .filter((tag, index, self) => self.indexOf(tag) === index)];

      setTags(newTags);
      setValue('tags', '');
    }
  }

  const handleTagsBlur = (e) => {
    const value = e.target.value.trim();
    if (value) {
      const newTags = [...tags, value].filter((tag, index, self) => self.indexOf(tag) === index);
      setTags(newTags);
      setValue('tags', newTags.join(', '));
      e.target.value = '';
    }
  }

  const removeTag = (tagToRemove) => {
    const updatedTags = tags.filter(tag => tag !== tagToRemove);
    setTags(updatedTags);
    setValue('tags', updatedTags.join(', '));

    const tagsInput = document.getElementById('tags');
    if (tagsInput) {
      tagsInput.value = updatedTags.join(', ');
    }
  }

  const handleContentChange = (content) => {
    setValue('content', content);
  }

  return (
    <DashboardLayout>
      <div className='dashboard__posts'>
        <div>
          <h1 className='dashboard__title'>Posts</h1>
          <p className='dashboard__subtitle'>Manage your posts here</p>
        </div>
        <div className='dashboard__posts__form__container'>
          <form ref={formRef} onSubmit={handleSubmit(handleUploadPost)}>
            <div className='dashboard__posts__container__left'>
              <div className='dashboard__posts__form'>
                <label htmlFor='title'>Title</label>
                <input
                  id='title'
                  {...register('title')}
                  placeholder='Enter the blog title'
                />
                {errors.title && <p className='error'>{errors.title.message}</p>}
              </div>

              <div className='dashboard__posts__form'>
                <label htmlFor='description'>Description</label>
                <textarea
                  id='description'
                  {...register('description')}
                  placeholder='Enter the blog meta description'
                  rows='3'
                />
                {errors.description && <p className='error'>{errors.description.message}</p>}
              </div>

              <div className='dashboard__posts__form' style={{ color: 'black' }}>
                <label>Content</label>
                <React.Suspense fallback={<Loading size='200px' borderColor='#ffb703' loadingText='Loading editor...' />}>
                  <TextEditor onChange={handleContentChange} />
                </React.Suspense>
                {errors.content && <p className='error'>{errors.content.message}</p>}
              </div>

              <div className='dashboard__posts__form'>
                <label htmlFor='tags'>Tags</label>
                <div className='dashboard__posts__form__tags'>
                  {tags.map((tag, index) => (
                    <span key={index} className='dashboard__posts__form__tag'>
                      <button
                        type='button'
                        onClick={() => removeTag(tag)}
                        className='tag__button'
                      >
                        <span>{tag}</span>
                        <IoClose className='tag__close' size={20} />
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  id='tags'
                  {...register('tags')}
                  placeholder='Enter tags and press comma or tab to add'
                  onChange={handleTagsChange}
                  onBlur={handleTagsBlur}
                />
                {errors.tags && <p className='error'>{errors.tags.message}</p>}
              </div>
            </div>

            <div className='dashboard__posts__container__right'>
              <div className='dashboard__posts__form'>
                <h4>
                  Featured Image
                </h4>
                <label htmlFor="image">
                  <div className='dashboard__posts__form__image'>
                    {imgSrc ? (
                      <img src={imgSrc} alt='Post preview' />
                    ) : (
                      <>
                        <span className='dashboard__posts__form__image__text'>Upload Image</span>
                        <span className='dashboard__posts__form__image__size'>Max size: 10MB</span>
                      </>
                    )}
                  </div>
                </label>
                <input
                  type="file"
                  id="image"
                  accept='image/*'
                  onChange={handleSetImage}
                  style={{ display: 'none' }}
                />
                {errors.image && <p className='error'>{errors.image.message}</p>}
              </div>
              <div className='dashboard__posts__notifier'>
                <span

                  style={{
                    color: nodification.type === 'error' ? '#d62828' : '#70e000',
                    fontWeight: 'bold',
                  }}

                >
                  {nodification.message || 'Ready to post!'}


                </span>
              </div>
              <div className='dashboard__buttons'>
                <button
                  className='dashboard__button'
                  type='submit'
                  disabled={isSubmitting}
                >
                  Post
                </button>
                <button
                  className='dashboard__button'
                  disabled={isSubmitting}
                  onClick={handleSubmit(handleSaveDraft)}
                  type='button'
                >
                  Save Draft
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Posts