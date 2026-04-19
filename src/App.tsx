import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Home from './pages/Home';
import ExplorePage from './pages/ExplorePage';
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import LoginPage from './pages/login-page/LoginPage.tsx';
import GlobalSpinner from './components/GlobalSpinner.tsx';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { fetchCurrentUser } from './store/slices/authSlicer';
import CreateProject from './pages/CreateProject.tsx';
import ImageUploadProject from './pages/ImageUploadProject.tsx';
import DonationSuccess from './pages/DonationSuccess.tsx';
import DonationCancel from './pages/DonationCancel.tsx';
import RegisterPage from './pages/register-page/RegisterPage.tsx';
import EmailPage from './pages/email-page/EmailPage.tsx';
import ResetPasswordPage from './pages/reset-password-page/ResetPasswordPage.tsx';
import SendResetPasswordPage from './pages/send-reset-password-page/SendResetPasswordPage.tsx';
import VerifyEmailToken from './pages/verfiy-email-token/VerfiyEmailToken.tsx';
import PrivateRoute from './components/PrivateRoute.tsx';
import GuestRoute from './components/GuestRoute.tsx';
import Layout from './components/Layout';
import Categories from './pages/Categories';
import CategoryProjects from './pages/CategoryProjects';
import SearchResults from './pages/SearchResults';
import ProjectDetails from './pages/projectDetails';
import Contact from './pages/Contact';
import About from './pages/About';
import PrivacyTerms from './pages/PrivacyTerms';
import NotFound from './pages/NotFound';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminProjectReports from './pages/admin/AdminProjectReports';
import AdminCommentReports from './pages/admin/AdminCommentReports';
import AdminReplyReports from './pages/admin/AdminReplyReports';
import AdminProjects from './pages/admin/AdminProjects';
import AdminUsers from './pages/admin/AdminUsers';
import AdminDonations from './pages/admin/AdminDonations';

export default function App() {
  const dispatch = useDispatch();
  const token = useSelector((state: any) => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(fetchCurrentUser() as any);
    }
  }, [dispatch, token]);
  return (
    <>
      <GlobalSpinner />
      <Toaster position="top-right" />
      <Routes>
        {/* Wrapped elements that need a nav + footer */}
        <Route element={<Layout />}>
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />

          <Route path="/explore" element={<ExplorePage />} />
          <Route
            path="/categories"
            element={
              <PrivateRoute>
                <Categories />
              </PrivateRoute>
            }
          />
          <Route
            path="/categories/:id/projects"
            element={
              <PrivateRoute>
                <CategoryProjects />
              </PrivateRoute>
            }
          />
          <Route
            path="/search"
            element={
              <PrivateRoute>
                <SearchResults />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <PrivateRoute>
                <ProjectDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/about"
            element={
              <PrivateRoute>
                <About />
              </PrivateRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <PrivateRoute>
                <Contact />
              </PrivateRoute>
            }
          />
          <Route
            path="/privacy&terms"
            element={
              <PrivateRoute>
                <PrivacyTerms />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile/edit"
            element={
              <PrivateRoute>
                <EditProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/projectDetails/:id"
            element={
              <PrivateRoute>
                <ProjectDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/createProject"
            element={
              <PrivateRoute>
                <CreateProject />
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/:id/images"
            element={
              <PrivateRoute>
                <ImageUploadProject />
              </PrivateRoute>
            }
          />
          <Route
            path="/donation/success"
            element={
              <PrivateRoute>
                <DonationSuccess />
              </PrivateRoute>
            }
          />
          <Route
            path="/donation/cancel"
            element={
              <PrivateRoute>
                <DonationCancel />
              </PrivateRoute>
            }
          />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="projects" element={<AdminProjects />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="donations" element={<AdminDonations />} />
          <Route path="reports/projects" element={<AdminProjectReports />} />
          <Route path="reports/comments" element={<AdminCommentReports />} />
          <Route path="reports/replies" element={<AdminReplyReports />} />
        </Route>

        <Route path="*" element={<NotFound />} />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <RegisterPage />
            </GuestRoute>
          }
        />
        <Route
          path="/email-verification"
          element={
            <GuestRoute>
              <EmailPage />
            </GuestRoute>
          }
        />
        <Route
          path="/send-reset-password"
          element={
            <GuestRoute>
              <SendResetPasswordPage />
            </GuestRoute>
          }
        />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route
          path="/verify"
          element={
            <GuestRoute>
              <VerifyEmailToken />
            </GuestRoute>
          }
        />
      </Routes>
    </>
  );
}
