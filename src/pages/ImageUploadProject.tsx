import { useState, useEffect } from 'react';
import withLoading from '../utils/WithLoading';
import api from '../utils/api.js';
import { useParams, useNavigate } from 'react-router';
import { toast } from 'react-hot-toast';
import { PulseLoader } from 'react-spinners';

// Inline Icons
const UploadCloudIcon = ({ className }: { className?: string }) => (
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
    <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242" />
    <path d="M12 12v9" />
    <path d="m16 16-4-4-4 4" />
  </svg>
);

const TrashIcon = ({ className }: { className?: string }) => (
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
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

const ImageIcon = ({ className }: { className?: string }) => (
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
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL;

function ImageUploadProject() {
  const params = useParams();
  const projectId = params.id;
  const navigate = useNavigate();

  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string>('');

  // Manage object URLs cleanly
  useEffect(() => {
    const newPreviews = images.map((file) => URL.createObjectURL(file));
    setPreviews(newPreviews);

    // Cleanup to prevent memory leaks
    return () => newPreviews.forEach((url) => URL.revokeObjectURL(url));
  }, [images]);

  const handleFileChange = (e: any) => {
    setError('');
    if (!e.target.files) return;

    const selectedFiles = Array.from(e.target.files) as File[];

    if (images.length + selectedFiles.length > 4) {
      setError('You can only upload a maximum of 4 images per project.');
      return;
    }

    setImages((prev) => [...prev, ...selectedFiles].slice(0, 4));
    // Reset the input value so the same file can be selected again if removed
    e.target.value = '';
  };

  const removeImage = (index: number) => {
    setError('');
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const [isUploading, setIsUploading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');

    if (images.length < 2) {
      setError('Please upload at least 2 images for your project.');
      return;
    }

    if (images.length > 4) {
      setError('Maximum 4 images allowed.');
      return;
    }

    setIsUploading(true);
    const uploadToast = toast.loading('Uploading your photos...');

    try {
      await withLoading(
        Promise.all(
          images.map((img) => {
            const formData = new FormData();
            formData.append('image', img);
            return api.post(`${BASE_URL}/projects/${projectId}/images/`, formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
            });
          })
        )
      );
      toast.success('Project published successfully!', { id: uploadToast });
      navigate(`/projectDetails/${projectId}`);
    } catch (err) {
      setError('An error occurred while uploading. Please try again later.');
      toast.error('Upload failed. Please try again.', { id: uploadToast });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-[4px] overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[var(--color-surface-highest)] rounded-[20px] overflow-hidden flex flex-col md:flex-row shadow-[0_20px_80px_rgba(17,17,17,0.06)] my-auto">
        <button 
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 z-[60] text-gray-400 hover:text-gray-800 bg-black/5 hover:bg-black/10 rounded-full p-2 transition-all shadow-sm"
          title="Close Dialog"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        {/* Left Side: Visual / Info Panel */}
        <div className="md:w-5/12 bg-gradient-to-br from-[var(--color-surface-container)] to-[var(--color-surface-low)] p-10 flex flex-col justify-center relative overflow-hidden hidden md:flex">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <ImageIcon className="w-64 h-64 text-[var(--color-primary)]" />
          </div>
          <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[var(--color-primary)] opacity-10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm">
              <ImageIcon className="w-7 h-7 text-[var(--color-primary)]" />
            </div>
            <h1 className="display-lg text-[var(--color-on-background)] mb-4 text-4xl leading-tight">
              Showcase Your <br />
              <span className="text-[var(--color-primary)]">Vision</span>
            </h1>
            <p className="body-md text-[var(--color-text-secondary)] mt-4 text-base leading-relaxed">
              High-quality images significantly increase your chances of reaching your funding goal.
              Upload between 2 and 4 engaging images to inspire your community.
            </p>
          </div>
        </div>

        {/* Right Side: Upload Form */}
        <div className="w-full md:w-7/12 p-8 md:p-12 relative flex flex-col">
          <h2 className="headline-md text-[var(--color-on-background)] text-2xl mb-2">
            Upload Project Images
          </h2>
          <p className="body-md text-[var(--color-text-secondary)] mb-8">
            Select 2 to 4 high-resolution images. The first image will be your gallery cover.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1">
            <div className="flex-1">
              {/* Dropzone Area */}
              <div className="relative w-full group">
                <input
                  type="file"
                  multiple
                  accept="image/png, image/jpeg, image/jpg, image/webp"
                  onChange={handleFileChange}
                  className={`absolute inset-0 w-full h-full opacity-0 z-10 ${images.length >= 4 ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  disabled={images.length >= 4}
                />
                <div
                  className={`w-full p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center transition-all duration-300 ${
                    images.length >= 4
                      ? 'border-[var(--color-outline-variant)] bg-[var(--color-surface-low)] opacity-50'
                      : 'border-[var(--color-primary)]/40 bg-orange-50/30 group-hover:bg-orange-50/70 group-hover:border-[var(--color-primary)]'
                  }`}
                >
                  <div className="w-12 h-12 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center mb-4">
                    <UploadCloudIcon className="w-6 h-6 text-[var(--color-primary)]" />
                  </div>
                  <h3 className="headline-md text-sm mb-1 text-[var(--color-on-background)] text-center">
                    {images.length >= 4
                      ? 'Maximum limit (4 images) reached'
                      : 'Click or drag images to upload'}
                  </h3>
                  <p className="body-md text-xs text-[var(--color-text-secondary)] text-center">
                    PNG, JPG, WEBP formats only
                  </p>
                </div>
              </div>

              {/* Validation / Error Message */}
              {error && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-100 flex items-center gap-2 text-red-600 text-sm font-medium animate-in fade-in slide-in-from-top-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-600 shrink-0"></span>
                  {error}
                </div>
              )}

              {/* Image Previews */}
              {images.length > 0 && (
                <div className="mt-8 animate-in fade-in">
                  <h4 className="label-md font-semibold text-[var(--color-on-background)] mb-4 flex justify-between items-center">
                    <span>Selected Previews</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider ${images.length < 2 || images.length > 4 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                    >
                      {images.length}/4
                    </span>
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    {previews.map((previewUrl, index) => (
                      <div
                        key={index}
                        className="relative group rounded-xl overflow-hidden border border-[var(--color-outline-variant)] aspect-video bg-[var(--color-surface-low)] shadow-sm"
                      >
                        <img
                          src={previewUrl}
                          alt={`preview-${index}`}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              // Prevent click from propagating logic behind just in case
                              e.preventDefault();
                              e.stopPropagation();
                              removeImage(index);
                            }}
                            className="bg-white/90 text-red-600 p-2.5 rounded-full shadow-lg transform hover:scale-110 transition-transform focus:outline-none"
                            title="Remove image"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-[var(--color-primary)] text-white text-[10px] uppercase tracking-wide font-bold px-2 py-0.5 rounded shadow-sm">
                            Cover
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-[var(--color-surface-container)] flex items-center justify-between">
              <span className="text-xs text-[var(--color-text-secondary)]">
                {images.length < 2 ? (
                  <span className="text-orange-500 font-medium">
                    Wait! You need {2 - images.length} more.
                  </span>
                ) : (
                  <span className="text-green-600 font-medium">
                    Ready to upload {images.length} photos!
                  </span>
                )}
              </span>
              <button
                type="submit"
                className={`btn-primary flex items-center gap-2 rounded-xl px-8 py-3.5 shadow-[0_4px_14px_0_rgba(255,86,0,0.39)] transition-all duration-200 ${
                  images.length < 2 || isUploading
                    ? 'opacity-50 cursor-not-allowed hover:shadow-none hover:transform-none'
                    : 'hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(255,86,0,0.3)]'
                }`}
                disabled={images.length < 2 || isUploading}
              >
                {isUploading ? (
                  <PulseLoader color="#fff" size={8} />
                ) : (
                  <UploadCloudIcon className="w-4 h-4" />
                )}
                <span>{isUploading ? 'Publishing...' : 'Publish Project'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ImageUploadProject;
