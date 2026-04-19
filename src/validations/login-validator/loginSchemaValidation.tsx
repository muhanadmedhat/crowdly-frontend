import * as Yup from 'yup';
const loginSchema = Yup.object({
  email: Yup.string().email('Invalid Email').required('Email is required'),
  password: Yup.string().min(6, 'Password too short').required('Password is required'),
});
export default loginSchema;
