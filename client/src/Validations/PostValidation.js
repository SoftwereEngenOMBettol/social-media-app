// Schemas/PostSchemaValidation.js
import * as yup from 'yup';

export const postValidationSchema = yup.object({
  content: yup
    .string()
    .required('Post content is required')
    .min(1, 'Post content cannot be empty')
    .max(2000, 'Post content cannot exceed 2000 characters'),
  image: yup
    .string()
    .url('Please enter a valid image URL')
    .nullable()
    .notRequired(),
  

});

export default postValidationSchema;