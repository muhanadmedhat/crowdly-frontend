import { useEffect, useState } from 'react';
import AuthorRow from '../components/AuthorRow.tsx';
import ImageSlider from '../components/ImageSlider.tsx';
import ProjectCardDetails from '../components/ProjectCardDetails.tsx';
import CreatorToolKit from '../components/CreatorToolKit.tsx';
import CommunityFeed from '../components/CommunityFeed.tsx';
import { getProjectImage, optimizeImage } from '../utils/image';
import { Link, useNavigate, useParams } from 'react-router';
import api from '../utils/api.js';
import withLoading from '../utils/WithLoading.tsx';
import { useSelector } from 'react-redux';
import DonationForm from './DonationForm.tsx';
import { toast } from 'react-hot-toast';
import Modal from '../components/Modal.tsx';

const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL;
function ProjectDetails() {
  const navigate = useNavigate();
  const params = useParams();

  const [project, setProject] = useState<any>(null);
  const [commentRefresh, setCommentRefresh] = useState(0);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [images, setImages] = useState<any[]>([]);
  const [similarProjects, setSimilarProjects] = useState<any[]>([]);
  const [donationAmount, setDonationAmount] = useState<number | string>('');
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('other');
  const [isReporting, setIsReporting] = useState(false);
  const user = useSelector((state: any) => state.auth.user);
  const handleRating = async () => {
    try {
      await withLoading(
        api.post(`${BASE_URL}/interactions/projects/${params.id}/ratings/`, { score: userRating })
      );
      toast.success('Thank you for your rating!');
      setCommentRefresh((prev) => prev + 1);
    } catch (error) {
      toast.error('Failed to submit rating. Please try again.');
    }
  };

  const handleReportProject = async () => {
    setIsReporting(true);
    try {
      await api.post(`${BASE_URL}/interactions/projects/${params.id}/reports/`, { reason: reportReason });
      toast.success('Project reported successfully');
      setIsReportModalOpen(false);
      setReportReason('other');
    } catch (error) {
      toast.error('Failed to report project. Please try again.');
    } finally {
      setIsReporting(false);
    }
  };

  useEffect(() => {
    const getProject = async () => {
      const projectDB = await api.get(`${BASE_URL}/projects/${params.id}/`);
      setProject(projectDB.data);
    };

    withLoading(getProject());
  }, [params.id]);
  useEffect(() => {
    const getRating = async () => {
      const ratingDB = await api.get(`${BASE_URL}/interactions/projects/${params.id}/ratings/`);
      setRating(ratingDB.data.avg);
    };
    withLoading(getRating());
  }, [params.id, commentRefresh]);

  useEffect(() => {
    const getImages = async () => {
      try {
        const imagesDB = await api.get(`${BASE_URL}/projects/${params.id}/images/`);
        const fetchedImages =
          imagesDB.data?.results || imagesDB.data?.result || imagesDB.data || [];
        const imageList = Array.isArray(fetchedImages) ? fetchedImages : [];
        // Map over the objects to extract the 'image' string URL because ImageSlider expects a string array
        setImages(imageList.map((img: any) => img.image_url || img.image || img));
      } catch (error) {
        console.error('Failed to load project images:', error);
        setImages([]);
      }
    };
    const getSimilarProjects = async () => {
      try {
        const similarDB = await api.get(`${BASE_URL}/projects/${params.id}/similar/`);
        const fetchedSimilar =
          similarDB.data?.results || similarDB.data?.result || similarDB.data || [];
        const similarArray = Array.isArray(fetchedSimilar) ? fetchedSimilar : [];
        const projectsWithImages = similarArray.map((proj: any) => {
          const coverImage = optimizeImage(getProjectImage(proj), 400);
          return { ...proj, coverImage };
        });

        setSimilarProjects(projectsWithImages as any);
      } catch (error) {
        console.error('Failed to load similar projects:', error);
        setSimilarProjects([]);
      }
    };

    withLoading(getImages());
    withLoading(getSimilarProjects());
  }, [params.id]);

  if (!project) {
    return <></>;
  }
  const percentage = Math.round((project.total_donated / project.total_target) * 100);
  const isExpired = Date.now() > Number(new Date(project.end_time));
  const daysLeft = isExpired
    ? 0
    : Math.ceil((Number(new Date(project.end_time)) - Date.now()) / (1000 * 60 * 60 * 24));
  return (
    <>
    <div className="flex flex-col lg:grid lg:grid-cols-3 gap-3 bg-[var(--color-background)] p-4 md:p-5">
      {/* ── Main content ── */}
      <div className="lg:col-span-2">
        <ImageSlider images={images}></ImageSlider>
        <div className="flex gap-2 flex-wrap items-center mt-6">
          <span className="bg-[rgba(255,86,0,0.1)] text-[var(--color-primary)] border border-[var(--color-primary)] rounded-md label-md px-2 py-1">
            {project.category.name}
          </span>
          {project.tags?.map((tag: any) => (
            <span
              key={tag.id}
              className="bg-[var(--color-surface-container)] text-[var(--color-text-secondary)] border border-[var(--color-outline-variant)] rounded-md label-md px-2 py-1"
            >
              #{tag.name}
            </span>
          ))}
        </div>
        <h1 className="display-lg mt-3 mb-2 text-2xl md:text-4xl lg:text-5xl">{project.title}</h1>
        <p className="body-md text-[var(--color-text-secondary)] leading-relaxed mb-6">
          {project.details}
        </p>
        <AuthorRow
          name={project.owner}
          date={new Date(project.created_at).toLocaleDateString()}
          daysLeft={daysLeft}
        />
        <br></br>
        <CommunityFeed
          projectId={String(project.id)}
        />
        <div className="mt-12">
          <h3 className="headline-md mb-6">You Might Also Like</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similarProjects.map((project: any, index) => (
              <Link to={`/projectDetails/${project.id}/`} key={project.id || index}>
                <ProjectCardDetails
                  image={
                    project.coverImage || 'https://placehold.co/400x300/f4f3f1/6b6b6b?text=No+Cover'
                  }
                  name={project.title}
                />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Sidebar ── */}
      <div className="lg:sticky lg:top-6 mt-6 lg:mt-0">
        <div className="card p-6">
          <h2 className="text-3xl font-bold text-[var(--color-on-background)]">
            ${project.total_donated}
          </h2>
          <p className="label-md text-[var(--color-text-secondary)] mt-1">
            pledged of {project.total_target} target
          </p>

          <div className="w-full bg-[var(--color-surface-container)] rounded-full h-2 mt-3">
            <div
              className="bg-[var(--color-primary)] h-2 rounded-full"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>

          <div className="mt-3">
            <p className="font-bold text-sm tracking-wide">{percentage}%</p>
            <p className="label-md text-[var(--color-text-secondary)]">Target Completed</p>
          </div>

          {/* Current Average Rating Display */}
          <div className="mt-4 pt-4 border-t border-[var(--color-outline-variant)]">
            <p className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-2">
              Project Rating
            </p>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-[#111]">
                {rating === null
                  ? '0.0'
                  : typeof rating === 'number'
                    ? rating.toFixed(1)
                    : parseFloat(rating).toFixed(1)}
              </span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={
                      star <= (rating ? Math.round(Number(rating)) : 0)
                        ? 'text-[var(--color-primary)] text-lg'
                        : 'text-[var(--color-surface-highest)] text-lg'
                    }
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* User Interaction: Rate the Project */}
          <div className="mt-4 pb-4 border-b border-[var(--color-outline-variant)]">
            <p className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2">
              Leave a Rating:
            </p>
            {isExpired ? (
              <p className="text-sm font-semibold text-red-500">
                Ratings are closed (Campaign Ended).
              </p>
            ) : (
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span
                      key={star}
                      onClick={() => setUserRating(star)}
                      className={`text-2xl cursor-pointer transition-colors ${
                        star <= userRating
                          ? 'text-yellow-500 drop-shadow-sm'
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                {userRating > 0 && (
                  <button
                    className="bg-[var(--color-primary)] hover:bg-gray-800 text-white text-xs font-bold py-2 px-4 rounded-full transition-colors"
                    onClick={handleRating}
                  >
                    Submit Rating
                  </button>
                )}
              </div>
            )}
          </div>

          {isExpired ? (
            <div className="mt-6 text-center">
              <button className="btn-primary w-full py-3 opacity-50 cursor-not-allowed" disabled>
                Campaign Ended
              </button>
              <p className="label-md text-red-500 font-semibold mt-3">
                This campaign is no longer accepting pledges.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-2 mt-6">
                {[50, 100, 200, 500].slice(0, 3).map((amount) => (
                  <div
                    key={amount}
                    onClick={() => {
                      setDonationAmount(amount);
                      setIsCustomAmount(false);
                    }}
                    className={`py-3 bg-white border ${!isCustomAmount && donationAmount === amount ? 'border-[var(--color-primary)] text-[var(--color-primary)] shadow-sm' : 'border-[var(--color-outline-variant)]'} rounded-lg text-center text-sm font-semibold cursor-pointer hover:border-[var(--color-primary)] transition-colors`}
                  >
                    {amount} EGP
                  </div>
                ))}

                <div
                  onClick={() => {
                    setDonationAmount(500);
                    setIsCustomAmount(false);
                  }}
                  className={`py-3 bg-white border ${!isCustomAmount && donationAmount === 500 ? 'border-[var(--color-primary)] text-[var(--color-primary)] shadow-sm' : 'border-[var(--color-outline-variant)]'} rounded-lg text-center text-sm font-semibold cursor-pointer hover:border-[var(--color-primary)] transition-colors`}
                >
                  500 EGP
                </div>

                <div
                  onClick={() => {
                    setDonationAmount('');
                    setIsCustomAmount(true);
                  }}
                  className={`bg-white col-span-2 py-3 border ${isCustomAmount ? 'border-[var(--color-primary)] text-[var(--color-primary)] shadow-sm' : 'border-[var(--color-outline-variant)]'} rounded-lg text-center text-sm font-semibold cursor-pointer hover:border-[var(--color-primary)] transition-colors`}
                >
                  {isCustomAmount ? (
                    <input
                      type="number"
                      onClick={(e) => e.stopPropagation()}
                      className="w-full text-center outline-none bg-transparent"
                      placeholder="Enter amount (EGP)"
                      value={donationAmount}
                      onChange={(e) => setDonationAmount(e.target.value)}
                      autoFocus
                    />
                  ) : (
                    'Custom ✎'
                  )}
                </div>
              </div>

              <DonationForm projectId={project.id} amount={donationAmount} />

              <p className="label-md text-[var(--color-text-secondary)] text-center mt-3">
                By pledging, you agree to our Editorial Guidelines.
              </p>
            </>
          )}
        </div>
        {user?.username === project.owner && (
          <CreatorToolKit
            id={Number(params.id)}
            percentage={percentage}
            isExpired={isExpired}
          ></CreatorToolKit>
        )}

        {user && user.username !== project.owner && (
          <div className="mt-4 pt-4 border-t border-[var(--color-outline-variant)] text-center">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="w-full py-2 px-4 text-sm font-semibold text-red-500 border border-red-300 rounded-lg hover:bg-red-50 hover:border-red-500 transition-colors"
            >
              🚩 Report this Project
            </button>
          </div>
        )}
      </div>
    </div>

    <Modal
      isOpen={isReportModalOpen}
      title="Report Project"
      message="Please select a reason for reporting this project:"
      confirmLabel="Submit Report"
      onConfirm={handleReportProject}
      onClose={() => setIsReportModalOpen(false)}
      isLoading={isReporting}
    >
      <div className="mt-4">
        <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
          Reason
        </label>
        <select
          value={reportReason}
          onChange={(e) => setReportReason(e.target.value)}
          className="w-full border border-[var(--color-outline-variant)] rounded-md px-3 py-2 bg-white text-sm outline-none"
          disabled={isReporting}
        >
          <option value="spam">Spam</option>
          <option value="inappropriate">Inappropriate Content</option>
          <option value="fraud">Fraud</option>
          <option value="other">Other</option>
        </select>
      </div>
    </Modal>
    </>
  );
}

export default ProjectDetails;

