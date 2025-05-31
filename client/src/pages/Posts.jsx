import React from 'react'
import DashboardLayout from '../layouts/DashboardLayout'
import { postSchema } from '../schema/posts.schema'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { IoClose } from "react-icons/io5";
import Loading from '../components/Loading'
const TextEditor = React.lazy(() => import('../components/TextEditor'))
import axios from '../utils/Axios';
import { toast } from 'react-toastify'

const Posts = () => {
  const [draftId, setDraftId] = React.useState(Date.now());
  const { register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
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
  const [notification, setNotification] = React.useState({
    type: '',
    message: ''
  });
  const formRef = React.useRef(null);
  const [imgSrc, setImgSrc] = React.useState(null);
  const [tags, setTags] = React.useState([]);
  const [isAutoSaving, setIsAutoSaving] = React.useState(false);

  const handleSaveDraft = React.useCallback(async(data, isAutoSave = false) => {
    if (isAutoSave) setIsAutoSaving(true);
    
    const formData = {
      ...data,
      image: imgSrc || '',
      tags: JSON.stringify(tags),
      draftId: draftId
    };

    try {
      const response = await axios.post('/blogs/save-draft', formData);
      
      if (!isAutoSave) {
        setNotification({
          type: 'success',
          message: response.data.message || 'Draft saved successfully!'
        });
        toast.success('Draft saved successfully!');
      } else {
        setNotification({
          type: 'success',
          message: 'Auto-saved'
        });
      }
    } catch (error) {
      console.error('Error saving draft:', error);
      const errorMessage = error.response?.data?.error || 'Failed to save draft';
      
      setNotification({
        type: 'error',
        message: errorMessage
      });
      
      if (!isAutoSave) {
        toast.error(errorMessage);
      }
    } finally {
      if (isAutoSave) {
        setIsAutoSaving(false);
        setTimeout(() => {
          setNotification(prev => prev.message === 'Auto-saved' ? { type: '', message: '' } : prev);
        }, 2000);
      }
    }
  }, [imgSrc, tags, draftId]);

  const handleUploadPost = async (data) => {
    const formData = {
      ...data,
      image: imgSrc || '',
      tags: JSON.stringify(tags),
      draftId: draftId
    };

    try {
      const response = await axios.post('/blogs/publish', formData);
      
      setNotification({
        type: 'success',
        message: response.data.message || 'Post published successfully!'
      });
      toast.success(response.data.message || 'Post published successfully!');
      
      reset();
      setTags([]);
      setImgSrc(null);
      setDraftId(Date.now());
      
    } catch (error) {
      console.error('Error publishing post:', error);
      const errorMessage = error.response?.data?.error || 'Failed to publish post';
      
      setNotification({
        type: 'error',
        message: Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage
      });
      toast.error(Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage);
    }
  }

  const handleSetImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Image size must be less than 10MB');
        return;
      }

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
      const newTags = value.split(',')
        .map(tag => tag.trim())
        .filter(tag => tag && !tags.includes(tag));
      
      if (newTags.length > 0) {
        setTags(prev => [...prev, ...newTags]);
      }
      setValue('tags', '');
    }
  }

  const handleTagsBlur = (e) => {
    const value = e.target.value.trim();
    if (value && !tags.includes(value)) {
      setTags(prev => [...prev, value]);
      setValue('tags', '');
    }
  }

  const handleTagsKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      const value = e.target.value.trim();
      if (value && !tags.includes(value)) {
        setTags(prev => [...prev, value]);
        setValue('tags', '');
      }
    }
  }

  const removeTag = (tagToRemove) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  }

  const handleContentChange = React.useCallback((content) => {
    setValue('content', content, { shouldValidate: false });
    clearTimeout(window.autoSaveTimeout);
    window.autoSaveTimeout = setTimeout(() => {
      const data = getValues();
      if (data.title?.trim() || data.description?.trim() || content?.trim() || tags.length > 0) {
        handleSaveDraft({ ...data, content }, true);
      }
    }, 5000);
  }, [setValue, getValues, tags, handleSaveDraft]);

  const autoSave = React.useCallback(() => {
    const data = getValues();
    if (data.title?.trim() || data.description?.trim() || data.content?.trim() || tags.length > 0) {
      handleSaveDraft(data, true);
    }
  }, [getValues, tags, handleSaveDraft]);

  React.useEffect(() => {
    clearTimeout(window.formAutoSaveTimeout);
    window.formAutoSaveTimeout = setTimeout(() => {
      autoSave();
    }, 5000);

    return () => clearTimeout(window.formAutoSaveTimeout);
  }, [tags, imgSrc]); 

  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        const data = getValues();
        handleSaveDraft(data);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [getValues]);

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
                  placeholder='Enter tags and press comma, tab, or enter to add'
                  onChange={handleTagsChange}
                  onBlur={handleTagsBlur}
                  onKeyDown={handleTagsKeyDown}
                />
                {errors.tags && <p className='error'>{errors.tags.message}</p>}
              </div>
            </div>

            <div className='dashboard__posts__container__right'>
              <div className='dashboard__posts__form'>
                <h4>Featured Image</h4>
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
                    color: notification.type === 'error' ? '#d62828' : '#70e000',
                    fontWeight: 'bold',
                  }}
                >
                  {isAutoSaving ? 'Auto-saving...' : (notification.message || 'Ready to post!')}
                </span>
              </div>
              
              <div className='dashboard__buttons'>
                <button
                  className='dashboard__button'
                  type='submit'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Publishing...' : 'Publish'}
                </button>
                <button
                  className='dashboard__button'
                  disabled={isSubmitting}
                  onClick={handleSubmit(handleSaveDraft)}
                  type='button'
                >
                  {isSubmitting ? 'Saving...' : 'Save Draft'}
                </button>
              </div>
              
              <div className='dashboard__help__text'>
                <small>Press Ctrl+S (Cmd+S on Mac) to save draft quickly</small>
              </div>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default Posts