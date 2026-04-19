import { useState, useMemo } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import _PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import Select from 'react-select';
import countryList from 'react-select-country-list';
const PhoneInput = (_PhoneInput as any).default || _PhoneInput;
import loginSchema from '../../validations/register-validator/registerSchemaValidation.tsx';
const initialValues = {
  username: '',
  first_name: '',
  last_name: '',
  phone: '',
  country: '',
  email: '',
  password: '',
  password2: '',
};

export default function RegisterForm({handleRegister}: {handleRegister: (values: any) => void}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const countryOptions = useMemo(() => countryList().getData(), []);

  return (
    <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleRegister}>
      {({ setFieldValue, setFieldTouched, values }) => (
        <Form className="flex flex-col">
        {/* Username */}
        <div className="flex flex-col mb-5 relative">
          <label htmlFor="username" className="text-[11px] font-bold tracking-[0.1em] text-[#666] uppercase mb-1">USERNAME</label>
          <Field type="text" name="username" id="username" placeholder="johndoe" className="w-full border-0 border-b border-[#ddd] focus:-mt-[1px] focus:border-b-2 focus:border-[#555] transition-colors bg-transparent outline-none pb-2 focus:pb-[9px] text-[15px] text-[#111] placeholder:text-[#aaa]" />
          <ErrorMessage name="username" component="div" className="text-[#d12c24] text-[10px] font-bold mt-1" />
        </div>

        {/* First and Last Name */}
        <div className="flex flex-col md:flex-row gap-4 mb-5">
          <div className="flex flex-col relative flex-1">
            <label htmlFor="first_name" className="text-[11px] font-bold tracking-[0.1em] text-[#666] uppercase mb-1">FIRST NAME</label>
            <Field type="text" name="first_name" id="first_name" placeholder="John" className="w-full border-0 border-b border-[#ddd] focus:-mt-[1px] focus:border-b-2 focus:border-[#555] transition-colors bg-transparent outline-none pb-2 focus:pb-[9px] text-[15px] text-[#111] placeholder:text-[#aaa]" />
            <ErrorMessage name="first_name" component="div" className="text-[#d12c24] text-[10px] font-bold mt-1" />
          </div>
          <div className="flex flex-col relative flex-1">
            <label htmlFor="last_name" className="text-[11px] font-bold tracking-[0.1em] text-[#666] uppercase mb-1">LAST NAME</label>
            <Field type="text" name="last_name" id="last_name" placeholder="Doe" className="w-full border-0 border-b border-[#ddd] focus:-mt-[1px] focus:border-b-2 focus:border-[#555] transition-colors bg-transparent outline-none pb-2 focus:pb-[9px] text-[15px] text-[#111] placeholder:text-[#aaa]" />
            <ErrorMessage name="last_name" component="div" className="text-[#d12c24] text-[10px] font-bold mt-1" />
          </div>
        </div>

        {/* Phone and Country */}
        <div className="flex flex-col md:flex-row gap-4 mb-5">
          <div className="flex flex-col relative flex-1">
            <label htmlFor="phone" className="text-[11px] font-bold tracking-[0.1em] text-[#666] uppercase mb-1">PHONE</label>
            <PhoneInput 
              country={'eg'}
              inputProps={{ placeholder: '+20 12 3456 7890' }}
              value={values.phone}
              onChange={(phone) => setFieldValue('phone', phone)}
              onBlur={() => setFieldTouched('phone', true)}
              inputStyle={{
                width: '100%',
                border: 'none',
                borderBottom: '1px solid #ddd',
                borderRadius: '0',
                backgroundColor: 'transparent',
                fontSize: '15px',
                color: '#111',
                paddingBottom: '10px'
              }}
              buttonStyle={{
                border: 'none',
                backgroundColor: 'transparent'
              }}
            />
            <ErrorMessage name="phone" component="div" className="text-[#d12c24] text-[10px] font-bold mt-1" />
          </div>
          <div className="flex flex-col relative flex-1">
            <label htmlFor="country" className="text-[11px] font-bold tracking-[0.1em] text-[#666] uppercase mb-1">COUNTRY</label>
            <Select
              options={countryOptions}
              value={countryOptions.find(option => option.label === values.country) || null}
              onChange={(option) => setFieldValue('country', option?.label || '')}
              onBlur={() => setFieldTouched('country', true)}
              placeholder="Select..."
              id="country"
              styles={{
                control: (base, state) => ({
                  ...base,
                  border: 'none',
                  borderBottom: state.isFocused ? '2px solid #555' : '1px solid #ddd',
                  borderRadius: 0,
                  backgroundColor: 'transparent',
                  boxShadow: 'none',
                  fontSize: '15px',
                  padding: 0,
                  paddingBottom: '2px',
                  color: '#111',
                  marginTop: state.isFocused ? '-1px' : '0px',
                }),
                valueContainer: (base) => ({
                  ...base,
                  padding: 0,
                }),
                dropdownIndicator: (base) => ({
                  ...base,
                  paddingTop: 0,
                  paddingBottom: 0,
                }),
                indicatorSeparator: () => ({
                  display: 'none',
                })
              }}
            />
            <ErrorMessage name="country" component="div" className="text-[#d12c24] text-[10px] font-bold mt-1" />
          </div>
        </div>

        <div className="flex flex-col mb-5 relative">
          <label
            htmlFor="email"
            className="text-[11px] font-bold tracking-[0.1em] text-[#666] uppercase mb-1"
          >
            EMAIL ADDRESS
          </label>
          <Field
            type="email"
            name="email"
            id="email"
            placeholder="name@example.com"
            className="w-full border-0 border-b border-[#ddd] focus:-mt-[1px] focus:border-b-2 focus:border-[#555] transition-colors bg-transparent outline-none pb-2 focus:pb-[9px] text-[15px] text-[#111] placeholder:text-[#aaa]"
          />
          <ErrorMessage
            name="email"
            component="div"
            className="text-[#d12c24] text-[10px] font-bold mt-1"
          />
        </div>

        <div className="flex flex-col mb-3">
          <label
            htmlFor="password"
            className="text-[11px] font-bold tracking-[0.1em] text-[#666] uppercase mb-1"
          >
            PASSWORD
          </label>
          <div className="relative flex items-center">
            <Field
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder="........."
              className="w-full border-0 border-b border-[#ddd] focus:-mt-[1px] focus:border-b-2 focus:border-[#555] transition-colors bg-transparent outline-none pb-2 focus:pb-[9px] text-[15px] text-[#111] placeholder:text-[#aaa] pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 bottom-0 pb-2 flex items-center text-[#999] hover:text-[#666] bg-transparent border-0 cursor-pointer"
              aria-label="Toggle password visibility"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-[20px] h-[20px]"
              >
                {showPassword ? (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </>
                ) : (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                )}
              </svg>
            </button>
          </div>
          <ErrorMessage name="password" component="div" className="text-[#d12c24] text-[10px] font-bold mt-1" />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col mb-4 relative">
          <label htmlFor="password2" className="text-[11px] font-bold tracking-[0.1em] text-[#666] uppercase mb-1">
            CONFIRM PASSWORD
          </label>
          <div className="relative flex items-center">
            <Field
              type={showConfirmPassword ? 'text' : 'password'}
              name="password2"
              id="password2"
              placeholder="........."
              className="w-full border-0 border-b border-[#ddd] focus:-mt-[1px] focus:border-b-2 focus:border-[#555] transition-colors bg-transparent outline-none pb-2 focus:pb-[9px] text-[15px] text-[#111] placeholder:text-[#aaa] pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-0 top-0 bottom-0 pb-2 flex items-center text-[#999] hover:text-[#666] bg-transparent border-0 cursor-pointer"
              aria-label="Toggle confirm password visibility"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-[20px] h-[20px]">
                {showConfirmPassword ? (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <line x1="2" y1="2" x2="22" y2="22" />
                  </>
                ) : (
                  <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </>
                )}
              </svg>
            </button>
          </div>
          <ErrorMessage name="password2" component="div" className="text-[#d12c24] text-[10px] font-bold mt-1" />
        </div>
        <button
          type="submit"
          className="w-full bg-[#151515] hover:bg-black transition-colors text-white border-0 py-3 px-6 rounded-[3px] text-[13px] font-bold tracking-[0.2em] uppercase cursor-pointer mb-2 mt-2"
        >
          REGISTER
        </button>
      </Form>
      )}
    </Formik>
  );
}
