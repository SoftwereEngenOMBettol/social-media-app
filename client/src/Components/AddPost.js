import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { createPost } from '../Features/PostSilce';
import postValidationSchema from '../Validations/PostValidation';

const AddPost = () => {
  const currentUser = useSelector((state) =>state.users?.user);
  const currentUserID = currentUser?._id;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(postValidationSchema),
  });

  const onSubmit = async (data) => {
    try {
      if (!currentUserID) {
        alert('Please login to create a post');
        navigate('/login');
        return;
      }
      await dispatch(createPost({ ...data, userId: currentUserID }));
      alert('Post created successfully!');
      navigate(`/my-posts/${currentUserID}`);
    } catch (error) {
      alert('Error creating post: ' + error.message);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header">
              <h4>Create New Post</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-3">
                  <textarea
                    {...register('content')}
                    className={`form-control ${errors.content ? 'is-invalid' : ''}`}
                    rows="4"
                    placeholder="What's on your mind?"
                  />
                  {errors.content && (
                    <div className="invalid-feedback">{errors.content.message}</div>
                  )}
                </div>
                
                <div className="mb-3">
                  <input
                    {...register('image')}
                    className={`form-control ${errors.image ? 'is-invalid' : ''}`}
                    placeholder="Image URL (optional)"
                  />
                  {errors.image && (
                    <div className="invalid-feedback">{errors.image.message}</div>
                  )}
                </div>
                
                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary" style={{backgroundColor: "orange", borderColor:"orange"}}>
                    Create Post
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-secondary"
                    onClick={() => navigate(`/my-posts/${currentUserID}`)}
                  >
                    View My Posts
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;