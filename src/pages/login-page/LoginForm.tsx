import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import loginSchema from '../../validations/login-validator/loginSchemaValidation';

const initialValues = {
  email: '',
  password: '',
};

export default function LoginForm({ handleLogin }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Formik initialValues={initialValues} validationSchema={loginSchema} onSubmit={handleLogin}>
      <Form className="flex flex-col">
        <div className="flex flex-col mb-6 relative">
          <label
            htmlFor="email"
            className="text-[11px] font-bold tracking-[0.1em] text-[#666] uppercase mb-3"
          >
            EMAIL ADDRESS
          </label>
          <Field
            type="email"
            name="email"
            id="email"
            placeholder="name@example.com"
            className="w-full border-0 border-b border-[#ddd] focus:-mt-[1px] focus:border-b-2 focus:border-[#555] transition-colors bg-transparent outline-none pb-2.5 focus:pb-[9px] text-lg text-[#111] placeholder:text-[#aaa]"
          />
          <ErrorMessage
            name="email"
            component="div"
            className="text-[#d12c24] text-[10px] font-bold mt-2 absolute -bottom-5"
          />
        </div>

        <div className="flex flex-col mb-3">
          <label
            htmlFor="password"
            className="text-[11px] font-bold tracking-[0.1em] text-[#666] uppercase mb-3"
          >
            PASSWORD
          </label>
          <div className="relative flex items-center">
            <Field
              type={showPassword ? 'text' : 'password'}
              name="password"
              id="password"
              placeholder="........."
              className="w-full border-0 border-b border-[#ddd] focus:-mt-[1px] focus:border-b-2 focus:border-[#555] transition-colors bg-transparent outline-none pb-2.5 focus:pb-[9px] text-lg text-[#111] placeholder:text-[#aaa] pr-10"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-[#d12c24] text-[10px] font-bold mt-2 absolute -bottom-5 left-0"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-0 top-0 bottom-0 pb-2.5 flex items-center text-[#999] hover:text-[#666] bg-transparent border-0 cursor-pointer"
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
        </div>
        <button
          type="submit"
          className="w-full bg-[#151515] hover:bg-black transition-colors text-white border-0 py-4 px-6 rounded-[3px] text-[13px] font-bold tracking-[0.2em] uppercase cursor-pointer mb-8 mt-4"
        >
          LOG IN
        </button>
      </Form>
    </Formik>
  );
}
