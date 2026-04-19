import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removeToken } from '../store/slices/authSlicer';
import { getMyProjects, getMyDonations, deleteMyAccount } from '../services/users';
import { cancelProject } from '../services/projects';
import ProjectCard from '../components/ProjectCard';
import LoadingSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import Modal from '../components/Modal';
import './ProfilePage.css';
export default function ProfilePage() {
  const navigate = useNavigate();
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();

  // ── Tab + data state ────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'projects' | 'donations'>('projects');
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [myDonations, setMyDonations] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [isLoadingDonations, setIsLoadingDonations] = useState(true);

  // ── Modal state ─────────────────────────────────────────────────────────────
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  // ── Fetch my projects ───────────────────────────────────────────────────────
  const fetchMyProjects = async () => {
    setIsLoadingProjects(true);
    try {
      const data = await getMyProjects();
      const payload = data?.results ?? data;
      setMyProjects(Array.isArray(payload) ? payload : []);
    } catch {
      setMyProjects([]);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // ── Fetch my donations ──────────────────────────────────────────────────────
  const fetchMyDonations = async () => {
    setIsLoadingDonations(true);
    try {
      const data = await getMyDonations();
      const payload = data?.results ?? data;
      setMyDonations(Array.isArray(payload) ? payload : []);
    } catch {
      setMyDonations([]);
    } finally {
      setIsLoadingDonations(false);
    }
  };

  useEffect(() => {
    fetchMyProjects();
    fetchMyDonations();
  }, []);

  // ── Delete account ──────────────────────────────────────────────────────────
  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteMyAccount();
      dispatch(removeToken());
      navigate('/');
    } catch {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  // ── Cancel campaign ─────────────────────────────────────────────────────────
  const handleCancelCampaign = async () => {
    if (selectedProjectId === null) return;
    setIsCancelling(true);
    try {
      await cancelProject(selectedProjectId);
      setIsCancelModalOpen(false);
      setSelectedProjectId(null);
      await fetchMyProjects();
    } catch {
      // keep modal open on error
    } finally {
      setIsCancelling(false);
    }
  };

  const openCancelModal = (id: number) => {
    setSelectedProjectId(id);
    setIsCancelModalOpen(true);
  };

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const getInitials = () => {
    if (!user) return '?';
    const first = user.username?.[0] ?? '';
    return first.toUpperCase();
  };

  const formatMemberSince = (dateStr: string | null) => {
    if (!dateStr) return '';
    return `Member since ${new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    })}`;
  };

  const formatDonationDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

  // ── Can this project be cancelled? ─────────────────────────────────────────
  const canCancel = (project: any) =>
    project.status === 'running' &&
    Number(project.total_donated) / Number(project.total_target) < 0.25;

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="profile-page">
      {/* ── Profile Header ── */}
      <div className="profile-header-card">
        {/* Avatar */}
        <div className="profile-avatar-wrap">
          {user?.profile_picture ? (
            <img src={user.profile_picture} alt="Profile" className="profile-avatar-img" />
          ) : (
            <div className="profile-avatar-initials">{getInitials()}</div>
          )}
        </div>

        {/* User info */}
        <div className="profile-info">
          <h1 className="profile-name">{user?.username ?? 'User'}</h1>
          <p className="profile-email">{user?.email}</p>
          {(user?.country || user?.phone) && (
            <p className="profile-meta">{[user.country, user.phone].filter(Boolean).join(' · ')}</p>
          )}
          {user?.date_joined && (
            <p className="profile-since">{formatMemberSince(user.date_joined)}</p>
          )}
        </div>

        {/* Action buttons */}
        <div className="profile-actions">
          <button
            id="edit-profile-btn"
            className="profile-btn profile-btn--outline"
            onClick={() => navigate('/profile/edit')}
          >
            Edit Profile
          </button>
          <button
            id="delete-account-btn"
            className="profile-btn profile-btn--danger"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete Account
          </button>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="profile-tabs-section">
        {/* Tab bar */}
        <div className="tab-bar" role="tablist">
          <button
            id="tab-projects"
            role="tab"
            aria-selected={activeTab === 'projects'}
            className={`tab-btn ${activeTab === 'projects' ? 'tab-btn--active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            My Projects
          </button>
          <button
            id="tab-donations"
            role="tab"
            aria-selected={activeTab === 'donations'}
            className={`tab-btn ${activeTab === 'donations' ? 'tab-btn--active' : ''}`}
            onClick={() => {
              setActiveTab('donations');
            }}
          >
            My Donations
          </button>
        </div>

        {/* Tab content card */}
        <div className="tab-content-card">
          {/* ── My Projects tab ── */}
          {activeTab === 'projects' && (
            <div role="tabpanel" aria-labelledby="tab-projects">
              {isLoadingProjects ? (
                <div className="project-grid">
                  <LoadingSkeleton count={3} />
                </div>
              ) : myProjects.length === 0 ? (
                <EmptyState
                  title="No projects yet"
                  message="You haven't created any fundraising campaigns yet."
                  actionLabel="Start a campaign"
                  onAction={() => navigate('/projects/create')}
                />
              ) : (
                <div className="project-grid">
                  {myProjects.map((project) => (
                    <div key={project.id} className="project-card-wrap">
                      <ProjectCard
                        id={project.id}
                        title={project.title}
                        details={project.details}
                        category={project.category?.name ?? ''}
                        total_target={Number(project.total_target)}
                        total_donated={Number(project.total_donated)}
                        end_time={project.end_time}
                        rating={project.average_rating ?? 0}
                        donor_count={project.donor_count ?? 0}
                        creator_name={project.creator ?? ''}
                        image={project.images?.[0]?.image}
                      />
                      {canCancel(project) && (
                        <button
                          id={`cancel-campaign-${project.id}`}
                          className="cancel-campaign-btn"
                          onClick={() => openCancelModal(project.id)}
                        >
                          Cancel Campaign
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── My Donations tab ── */}
          {activeTab === 'donations' && (
            <div role="tabpanel" aria-labelledby="tab-donations">
              {isLoadingDonations ? (
                <div className="donation-skeleton-list">
                  {Array.from({ length: 5 }, (_, i) => (
                    <div key={i} className="donation-skeleton-row skeleton-pulse" />
                  ))}
                </div>
              ) : myDonations.length === 0 ? (
                <EmptyState
                  title="No donations yet"
                  message="You haven't donated to any project yet."
                  actionLabel="Explore projects"
                  onAction={() => navigate('/projects')}
                />
              ) : (
                <ul className="donation-list">
                  {myDonations.map((donation: any) => (
                    <li key={donation.id} className="donation-row">
                      <div className="donation-row-left">
                        <span className="donation-project-title">
                          {donation.project?.title ?? donation.project_title ?? 'Project'}
                        </span>
                        <span className="donation-date">
                          {formatDonationDate(donation.created_at ?? donation.date)}
                        </span>
                      </div>
                      <span className="donation-amount">
                        EGP {Number(donation.amount).toFixed(2)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Delete Account Modal ── */}
      <Modal
        isOpen={isDeleteModalOpen}
        title="Delete your account?"
        message="This action is permanent and cannot be undone. All your projects and donations history will be lost."
        confirmLabel="Yes, delete my account"
        cancelLabel="Keep my account"
        isDangerous={true}
        isLoading={isDeleting}
        onConfirm={handleDeleteAccount}
        onClose={() => setIsDeleteModalOpen(false)}
      />

      {/* ── Cancel Campaign Modal ── */}
      <Modal
        isOpen={isCancelModalOpen}
        title="Cancel this campaign?"
        message="You can only cancel a campaign if it has received less than 25% of its funding goal. This cannot be undone."
        confirmLabel="Yes, cancel campaign"
        cancelLabel="Keep campaign running"
        isDangerous={true}
        isLoading={isCancelling}
        onConfirm={handleCancelCampaign}
        onClose={() => setIsCancelModalOpen(false)}
      />
    </div>
  );
}
