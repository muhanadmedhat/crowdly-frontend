import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { useEffect, useState } from 'react';
import api from '../utils/api.js';
import withLoading from '../utils/WithLoading';
import { useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';

const RocketIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
  </svg>
);

const TargetIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <circle cx="12" cy="12" r="6" />
    <circle cx="12" cy="12" r="2" />
  </svg>
);

const LayersIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL;

function CreateProject() {
  const [categories, setCategories] = useState([]);
  const [tags, setTags] = useState([]);

  const validationSchema = Yup.object({
    title: Yup.string().required('Required').min(5).max(50),
    details: Yup.string().required('Required').min(30).max(500),
    total_target: Yup.number().required('Required').min(5),
    start_time: Yup.date().required('Required').min(new Date(), 'Must be in future'),
    end_time: Yup.date()
      .required('Required')
      .min(Yup.ref('start_time'), 'Must be after start date'),
    category: Yup.number().required('Required'),
    tags: Yup.array().min(1, 'Required'),
    status: Yup.string().required('Required'),
  });

  const initialValues = {
    title: '',
    details: '',
    total_target: undefined,
    start_time: new Date().toISOString().split('T')[0],
    end_time: new Date().toISOString().split('T')[0],
    category: '',
    tags: [],
    status: '',
  };

  const navigate = useNavigate();
  const handleSubmit = async (value: any) => {
    try {
      const res = await withLoading(api.post(`${BASE_URL}/projects/`, value));
      const projectId = res.data.id;
      toast.success('Project details saved! Now let\'s add some images.');
      navigate(`/projects/${projectId}/images/`);
    } catch (err) {
      toast.error('Failed to create project. Please check the fields.');
    }
  };

  useEffect(() => {
    const getCategories = async () => {
      const categoriesDB = await api.get(`${BASE_URL}/projects/categories/`);
      setCategories(
        categoriesDB.data?.results || categoriesDB.data?.result || categoriesDB.data || []
      );
    };

    const getTags = async () => {
      const tagsDB = await api.get(`${BASE_URL}/projects/tags/`);
      setTags(tagsDB.data?.results || tagsDB.data?.result || tagsDB.data || []);
    };

    withLoading(getCategories());
    withLoading(getTags());
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[4px] overflow-y-auto">
      <div
        className="relative w-full max-w-6xl grid grid-cols-1 lg:grid-cols-5 bg-[var(--color-surface-highest)] rounded-[20px] overflow-hidden my-auto"
        style={{ boxShadow: 'var(--shadow-float)' }}
      >
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 z-[60] text-gray-400 hover:text-gray-800 bg-white/50 hover:bg-white rounded-full p-2 transition-all shadow-sm"
          title="Close Dialog"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        {/* Left Side: Visual / Info Panel */}
        <div className="lg:col-span-2 relative bg-gradient-to-br from-[var(--color-surface-container)] to-[var(--color-surface-low)] p-10 flex flex-col justify-between overflow-hidden">
          {/* Decorative Background Elements */}
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <RocketIcon className="w-64 h-64 text-[var(--color-primary)]" />
          </div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[var(--color-primary)] opacity-10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 mt-8">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <RocketIcon className="w-7 h-7 text-[var(--color-primary)]" />
            </div>
            <h1 className="display-lg text-[var(--color-on-background)] mb-4 text-4xl md:text-5xl leading-tight">
              Bring Your <br />
              <span className="text-[var(--color-primary)]">Idea</span> to Life
            </h1>
            <p className="body-md text-[var(--color-text-secondary)] mt-4 max-w-[280px] text-base leading-relaxed">
              Start your campaign today and connect with a community that believes in your vision.
            </p>
          </div>

          <div className="relative z-10 space-y-4 mt-12 mb-8">
            <div className="p-5 bg-white/60 backdrop-blur-md rounded-2xl border border-white flex items-start gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
              <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                <TargetIcon className="w-5 h-5 text-[var(--color-primary)]" />
              </div>
              <div>
                <h4 className="headline-md text-[15px] mb-1">Set Your Goal</h4>
                <p className="body-md text-[13px] text-[var(--color-text-secondary)] leading-snug">
                  Be realistic and transparent about your exact funding needs.
                </p>
              </div>
            </div>

            <div className="p-5 bg-white/60 backdrop-blur-md rounded-2xl border border-white flex items-start gap-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-shadow duration-300">
              <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                <LayersIcon className="w-5 h-5 text-slate-700" />
              </div>
              <div>
                <h4 className="headline-md text-[15px] mb-1">Detailed Execution</h4>
                <p className="body-md text-[13px] text-[var(--color-text-secondary)] leading-snug">
                  A well-defined story engages backers faster.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="lg:col-span-3 bg-white p-8 md:p-12 lg:h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="mb-8 border-b border-[var(--color-surface-container)] pb-6">
            <h2 className="headline-md text-[var(--color-on-background)] text-2xl">
              Campaign Details
            </h2>
            <p className="body-md text-[var(--color-text-secondary)] mt-2">
              Please fill in all required fields to proceed to the next stage.
            </p>
          </div>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }: { isSubmitting: boolean }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
                  <div className="md:col-span-2">
                    <div className="flex justify-between items-end mb-1.5">
                      <label className="label-md font-semibold text-[var(--color-on-background)]">
                        Project Title
                      </label>
                      <ErrorMessage
                        name="title"
                        component="span"
                        className="text-red-500 text-[10px] font-bold uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded"
                      />
                    </div>
                    <Field
                      name="title"
                      type="text"
                      placeholder="e.g. Next-Gen Smart Home Hub"
                      className="w-full bg-[var(--color-surface-low)] rounded-xl px-4 py-3.5 text-sm outline-none border border-transparent focus:border-[var(--color-primary)] focus:bg-white focus:shadow-[0_4px_20px_rgba(255,86,0,0.08)] transition-all text-[var(--color-on-background)]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex justify-between items-end mb-1.5">
                      <label className="label-md font-semibold text-[var(--color-on-background)]">
                        Details & Description
                      </label>
                      <ErrorMessage
                        name="details"
                        component="span"
                        className="text-red-500 text-[10px] font-bold uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded"
                      />
                    </div>
                    <Field
                      name="details"
                      as="textarea"
                      rows="5"
                      placeholder="Share your inspiring story..."
                      className="w-full bg-[var(--color-surface-low)] rounded-xl px-4 py-3.5 text-sm resize-none outline-none border border-transparent focus:border-[var(--color-primary)] focus:bg-white focus:shadow-[0_4px_20px_rgba(255,86,0,0.08)] transition-all text-[var(--color-on-background)]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <label className="label-md font-semibold text-[var(--color-on-background)]">
                        Target Goal ($)
                      </label>
                      <ErrorMessage
                        name="total_target"
                        component="span"
                        className="text-red-500 text-[10px] font-bold uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded"
                      />
                    </div>
                    <Field
                      name="total_target"
                      type="number"
                      placeholder="10000"
                      className="w-full bg-[var(--color-surface-low)] rounded-xl px-4 py-3.5 text-sm outline-none border border-transparent focus:border-[var(--color-primary)] focus:bg-white focus:shadow-[0_4px_20px_rgba(255,86,0,0.08)] transition-all text-[var(--color-on-background)]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <label className="label-md font-semibold text-[var(--color-on-background)]">
                        Category
                      </label>
                      <ErrorMessage
                        name="category"
                        component="span"
                        className="text-red-500 text-[10px] font-bold uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded"
                      />
                    </div>
                    <Field
                      name="category"
                      as="select"
                      className="w-full bg-[var(--color-surface-low)] rounded-xl px-4 py-3.5 text-sm outline-none border border-transparent focus:border-[var(--color-primary)] focus:bg-white focus:shadow-[0_4px_20px_rgba(255,86,0,0.08)] transition-all cursor-pointer text-[var(--color-on-background)] app-appear"
                    >
                      <option value="" disabled>
                        Select a category
                      </option>
                      {categories.map((cat: any) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </Field>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <label className="label-md font-semibold text-[var(--color-on-background)]">
                        Start Date
                      </label>
                      <ErrorMessage
                        name="start_time"
                        component="span"
                        className="text-red-500 text-[10px] font-bold uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded"
                      />
                    </div>
                    <Field
                      name="start_time"
                      type="date"
                      className="w-full bg-[var(--color-surface-low)] rounded-xl px-4 py-3.5 text-sm outline-none border border-transparent focus:border-[var(--color-primary)] focus:bg-white focus:shadow-[0_4px_20px_rgba(255,86,0,0.08)] transition-all text-[var(--color-on-background)]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-1.5">
                      <label className="label-md font-semibold text-[var(--color-on-background)]">
                        End Date
                      </label>
                      <ErrorMessage
                        name="end_time"
                        component="span"
                        className="text-red-500 text-[10px] font-bold uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded"
                      />
                    </div>
                    <Field
                      name="end_time"
                      type="date"
                      className="w-full bg-[var(--color-surface-low)] rounded-xl px-4 py-3.5 text-sm outline-none border border-transparent focus:border-[var(--color-primary)] focus:bg-white focus:shadow-[0_4px_20px_rgba(255,86,0,0.08)] transition-all text-[var(--color-on-background)]"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex justify-between items-end mb-1.5">
                      <label className="label-md font-semibold text-[var(--color-on-background)]">
                        Tags{' '}
                        <span className="text-gray-400 font-normal lowercase">
                          (Hold Ctrl/Cmd for multiple)
                        </span>
                      </label>
                      <ErrorMessage
                        name="tags"
                        component="span"
                        className="text-red-500 text-[10px] font-bold uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded"
                      />
                    </div>
                    <Field
                      name="tags"
                      as="select"
                      multiple
                      className="w-full bg-[var(--color-surface-low)] rounded-xl p-3 text-sm outline-none border border-transparent focus:border-[var(--color-primary)] focus:bg-white focus:shadow-[0_4px_20px_rgba(255,86,0,0.08)] transition-all h-36 text-[var(--color-on-background)] custom-scrollbar"
                    >
                      {tags.map((tag: any) => (
                        <option
                          key={tag.id}
                          value={tag.id}
                          className="py-2 px-3 mb-1 rounded-lg cursor-pointer hover:bg-slate-200 checked:bg-[var(--color-primary)] checked:text-white transition-colors"
                        >
                          {tag.name}
                        </option>
                      ))}
                    </Field>
                  </div>

                  <div className="md:col-span-2">
                    <div className="flex justify-between items-end mb-1.5">
                      <label className="label-md font-semibold text-[var(--color-on-background)]">
                        Project Status
                      </label>
                      <ErrorMessage
                        name="status"
                        component="span"
                        className="text-red-500 text-[10px] font-bold uppercase tracking-wider bg-red-50 px-2 py-0.5 rounded"
                      />
                    </div>
                    <Field
                      name="status"
                      as="select"
                      className="w-full bg-[var(--color-surface-low)] rounded-xl px-4 py-3.5 text-sm outline-none border border-transparent focus:border-[var(--color-primary)] focus:bg-white focus:shadow-[0_4px_20px_rgba(255,86,0,0.08)] transition-all cursor-pointer text-[var(--color-on-background)]"
                    >
                      <option value="" disabled>
                        Select project status...
                      </option>
                      <option value="running">Running</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="completed">Completed</option>
                    </Field>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-[var(--color-surface-container)] flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-6 py-3.5 rounded-xl font-display font-semibold text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-on-background)] hover:bg-[var(--color-surface-low)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary rounded-xl px-10 py-3.5 flex items-center gap-2 shadow-[0_4px_14px_0_rgba(255,86,0,0.39)] hover:shadow-[0_6px_20px_rgba(255,86,0,0.23)] hover:-translate-y-0.5 transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Launch Campaign</span>
                        <RocketIcon className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default CreateProject;
