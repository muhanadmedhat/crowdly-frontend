import * as Yup from 'yup';

const registerSchema = Yup.object({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters long')
    .max(150, 'Username cannot exceed 150 characters')
    .required('Username is required'),
  first_name: Yup.string()
    .min(2, 'First name must be at least 2 characters long')
    .max(150, 'First name cannot exceed 150 characters')
    .optional(),
  last_name: Yup.string()
    .min(2, 'Last name must be at least 2 characters long')
    .max(150, 'Last name cannot exceed 150 characters')
    .optional(),
  phone: Yup.string()
    .matches(/^[0-9+() -]+$/, 'Please enter a valid phone number')
    .min(8, 'Phone number is too short')
    .max(20, 'Phone number cannot exceed 20 characters')
    .required('Phone number is required'),
  country: Yup.string()
    .max(100, 'Country name cannot exceed 100 characters')
    .optional(),
  email: Yup.string()
    .email('Please enter a valid email address')
    .required('Email address is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),
  password2: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

export default registerSchema;
