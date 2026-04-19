import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from '../store/slices/authSlicer';
import { patchMyProfile } from '../services/users';
import type { UpdateUserPayload } from '../services/users';
import './EditProfilePage.css';

// ── Validation helpers ────────────────────────────────────────────────────
const EG_PHONE_RE = /^(\+20|0)?1[0125][0-9]{8}$/;

function validate(data: typeof EMPTY_FORM): Record<string, string> {
  const errs: Record<string, string> = {};

  if (!data.first_name.trim()) errs.first_name = 'First name is required.';
  if (!data.last_name.trim()) errs.last_name = 'Last name is required.';

  if (data.phone && !EG_PHONE_RE.test(data.phone)) {
    errs.phone = 'Enter a valid Egyptian phone number (e.g. 01012345678).';
  }

  if (data.facebook_profile && !data.facebook_profile.startsWith('https://')) {
    errs.facebook_profile = 'Facebook URL must start with https://';
  }

  if (data.birthdate) {
    const chosen = new Date(data.birthdate);
    if (chosen >= new Date()) errs.birthdate = 'Birthdate must be in the past.';
  }

  return errs;
}

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  birthdate: '',
  country: '',
  facebook_profile: '',
};

export default function EditProfilePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state: any) => state.auth);

  // ── Form state ────────────────────────────────────────────────────────────
  const [formData, setFormData] = useState({ ...EMPTY_FORM });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // ── Pre-fill form from auth context ──────────────────────────────────────
  useEffect(() => {
    if (!user) return;
    setFormData({
      first_name: user.first_name ?? '',
      last_name: user.last_name ?? '',
      email: user.email ?? '',
      phone: user.phone ?? '',
      birthdate: user.birth_date ?? '',
      country: user.country ?? '',
      facebook_profile: user.facebook_profile ?? '',
    });
  }, [user]);

  // ── Field change ──────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // clear field-level error on change
    if (errors[name])
      setErrors((prev) => {
        const n = { ...prev };
        delete n[name];
        return n;
      });
  };

  // ── Build diff payload ────────────────────────────────────────────────────
  const buildPayload = (): Partial<UpdateUserPayload> => {
    const payload: Partial<UpdateUserPayload> = {};
    // Map UserProfileResponse fields → payload fields
    const orig = {
      first_name: user?.first_name ?? '',
      last_name: user?.last_name ?? '',
      phone: user?.phone ?? '',
      birthdate: user?.birth_date ?? '',
      country: user?.country ?? '',
      facebook_profile: user?.facebook_profile ?? '',
    };

    if (formData.first_name !== orig.first_name) payload.first_name = formData.first_name;
    if (formData.last_name !== orig.last_name) payload.last_name = formData.last_name;
    if (formData.phone !== orig.phone) payload.phone = formData.phone;
    if (formData.birthdate !== orig.birthdate) payload.birthdate = formData.birthdate;
    if (formData.country !== orig.country) payload.country = formData.country;

    return payload;
  };

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    const fieldErrors = validate(formData);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    const payload = buildPayload();
    if (Object.keys(payload).length === 0) {
      // Nothing changed — just go back
      navigate('/profile');
      return;
    }

    setIsSubmitting(true);
    try {
      await patchMyProfile(payload);
      dispatch(fetchCurrentUser() as any);
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => navigate('/profile'), 1500);
    } catch {
      setErrorMessage('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const initials = (user?.username ?? user?.first_name ?? '?')[0].toUpperCase();

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="edit-profile-page">
      <div className="edit-profile-card">
        {/* ── Card header ── */}
        <div className="edit-profile-header">
          <button
            id="edit-profile-back"
            className="back-btn"
            type="button"
            onClick={() => navigate('/profile')}
            aria-label="Go back to profile"
          >
            ←
          </button>
          <h1 className="edit-profile-title">Edit Profile</h1>
        </div>

        {/* ── Avatar Initials ── */}
        <div className="edit-avatar-section">
          <div className="edit-avatar-circle">
            <span className="edit-avatar-initials">{initials}</span>
          </div>
        </div>

        {/* ── Form ── */}
        <form className="edit-profile-form" onSubmit={handleSubmit} noValidate>
          {/* Username — disabled */}
          <div className="form-field">
            <label htmlFor="edit-username" className="field-label">
              Username
            </label>
            <input
              id="edit-username"
              name="username"
              type="text"
              className="field-input field-input--disabled"
              value={user?.username ?? ''}
              disabled
            />
            <p className="field-hint">Username cannot be changed</p>
          </div>

          {/* First name */}
          <div className="form-field">
            <label htmlFor="edit-first-name" className="field-label">
              First name <span className="required-star">*</span>
            </label>
            <input
              id="edit-first-name"
              name="first_name"
              type="text"
              className={`field-input ${errors.first_name ? 'field-input--error' : ''}`}
              value={formData.first_name}
              onChange={handleChange}
              autoComplete="given-name"
              required
            />
            {errors.first_name && <p className="field-error">{errors.first_name}</p>}
          </div>

          {/* Last name */}
          <div className="form-field">
            <label htmlFor="edit-last-name" className="field-label">
              Last name <span className="required-star">*</span>
            </label>
            <input
              id="edit-last-name"
              name="last_name"
              type="text"
              className={`field-input ${errors.last_name ? 'field-input--error' : ''}`}
              value={formData.last_name}
              onChange={handleChange}
              autoComplete="family-name"
              required
            />
            {errors.last_name && <p className="field-error">{errors.last_name}</p>}
          </div>

          {/* Mobile phone */}
          <div className="form-field">
            <label htmlFor="edit-phone" className="field-label">
              Mobile phone
            </label>
            <input
              id="edit-phone"
              name="phone"
              type="tel"
              className={`field-input ${errors.phone ? 'field-input--error' : ''}`}
              value={formData.phone}
              onChange={handleChange}
              placeholder="01012345678"
              autoComplete="tel"
            />
            {errors.phone && <p className="field-error">{errors.phone}</p>}
          </div>

          {/* Birthdate */}
          <div className="form-field">
            <label htmlFor="edit-birthdate" className="field-label">
              Birthdate
            </label>
            <input
              id="edit-birthdate"
              name="birthdate"
              type="date"
              className={`field-input ${errors.birthdate ? 'field-input--error' : ''}`}
              value={formData.birthdate}
              onChange={handleChange}
            />
            {errors.birthdate && <p className="field-error">{errors.birthdate}</p>}
          </div>

          {/* Country */}
          <div className="form-field">
            <label htmlFor="edit-country" className="field-label">
              Country
            </label>
            <input
              id="edit-country"
              name="country"
              type="text"
              className="field-input"
              value={formData.country}
              onChange={handleChange}
              autoComplete="country-name"
            />
          </div>

          {/* Feedback messages */}
          {successMessage && <p className="form-success">{successMessage}</p>}
          {errorMessage && <p className="form-error-msg">{errorMessage}</p>}

          {/* ── Buttons ── */}
          <div className="form-actions">
            <button
              id="edit-cancel-btn"
              type="button"
              className="action-btn action-btn--cancel"
              onClick={() => navigate('/profile')}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              id="edit-save-btn"
              type="submit"
              className="action-btn action-btn--save"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
