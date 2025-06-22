import React, { Suspense, lazy, useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { SuperuserContext } from './contexts/SuperuserContext'; // Assuming SuperuserContext provides superuser info
// import { isTokenExpired } from 'pocketbase'; // Placeholder for now

// --- Placeholder Page Imports (actual components will be in ./pages) ---
const PageInstaller = lazy(() => import('./pages/PageInstaller'));
const PageSuperuserLogin = lazy(() => import('./pages/PageSuperuserLogin'));
const PageSuperuserRequestPasswordReset = lazy(() => import('./pages/PageSuperuserRequestPasswordReset'));
const PageSuperuserConfirmPasswordReset = lazy(() => import('./pages/PageSuperuserConfirmPasswordReset'));
const PageCollections = lazy(() => import('./pages/PageCollections'));
const PageRecords = lazy(() => import('./pages/PageRecords'));
const PageRecordView = lazy(() => import('./pages/PageRecordView'));
const PageRecordEdit = lazy(() => import('./pages/PageRecordEdit'));
const PageRecordCreate = lazy(() => import('./pages/PageRecordCreate'));
const PageSettings = lazy(() => import('./pages/PageSettings'));
const PageLogs = lazy(() => import('./pages/PageLogs'));
const PageAdmins = lazy(() => import('./pages/PageAdmins'));
const PageAdminEdit = lazy(() => import('./pages/PageAdminEdit'));
const PageAdminCreate = lazy(() => import('./pages/PageAdminCreate'));
const PageNotFound = lazy(() => import('./pages/PageNotFound'));
const PageOAuth2RedirectSuccess = lazy(() => import('./pages/PageOAuth2RedirectSuccess'));
const PageOAuth2RedirectFailure = lazy(() => import('./pages/PageOAuth2RedirectFailure'));
const PageRecordConfirmPasswordReset = lazy(() => import('./pages/PageRecordConfirmPasswordReset'));
const PageRecordConfirmVerification = lazy(() => import('./pages/PageRecordConfirmVerification'));
const PageRecordConfirmEmailChange = lazy(() => import('./pages/PageRecordConfirmEmailChange'));

// --- Placeholder Auth Hook (replace with actual implementation) ---
const useAuth = () => {
  const { superuser } = useContext(SuperuserContext);
  // Replace with actual auth logic using ApiClient or similar
  // For now, consider superuser to be authenticated if the object is not empty.
  const isAuthenticated = superuser && Object.keys(superuser).length > 0;
  // console.log("useAuth: isAuthenticated", isAuthenticated, "superuser:", superuser); // For debugging
  return { isAuthenticated };
};

// --- Route Guard Components ---
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) {
    // Default redirect for authenticated users trying to access public-only routes
    return <Navigate to="/collections" replace />;
  }
  return children;
};

// --- Special Route for Installer with Token Check ---
const InstallerRoute = () => {
  const { token } = useParams();
  // const pocketbaseUrl = ''; // This would come from config or context
  // const pb = new PocketBase(pocketbaseUrl); // Initialize PocketBase client
  // const tokenValid = token && !isTokenExpired(token, pb.settings.tokenAuthKey); // Placeholder: Actual isTokenExpired usage
  const tokenValid = !!token; // Simplified placeholder logic

  if (tokenValid) {
    return <PageInstaller />;
  }
  // If token is invalid or not present, redirect or show an error.
  // For now, redirecting to login as a fallback.
  return <Navigate to="/login" replace />;
};


// --- Router Configuration ---
const RouterConfig = () => {
  // Sidebar visibility notes (from Svelte routes userData: { showAppSidebar: boolean }):
  // Routes requiring sidebar:
  // - /collections
  // - /collections/:collectionIdOrName
  // - /collections/:collectionIdOrName/records/:recordId
  // - /collections/:collectionIdOrName/records/:recordId/edit
  // - /collections/:collectionIdOrName/records/create
  // - /settings
  // - /logs
  // - /admins
  // - /admins/create
  // - /admins/:adminId
  //
  // Routes NOT requiring sidebar:
  // - /
  // - /login
  // - /_superuser/request-password-reset
  // - /_superuser/confirm-password-reset/:token
  // - /_oauth2/redirect/success
  // - /_oauth2/redirect/failure
  // - /_pbinstal/:token
  // - /_pb/records/password-reset/:token
  // - /_pb/records/verification/:token
  // - /_pb/records/email-change/:token
  // - (wildcard / not found)

  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute><PageSuperuserLogin /></PublicRoute>} />
          <Route path="/_superuser/request-password-reset" element={<PublicRoute><PageSuperuserRequestPasswordReset /></PublicRoute>} />
          <Route path="/_superuser/confirm-password-reset/:token" element={<PublicRoute><PageSuperuserConfirmPasswordReset /></PublicRoute>} />

          {/* Installer Route */}
          <Route path="/_pbinstal/:token" element={<InstallerRoute />} />

          {/* OAuth2 Redirect Routes */}
          <Route path="/_oauth2/redirect/success" element={<PageOAuth2RedirectSuccess />} />
          <Route path="/_oauth2/redirect/failure" element={<PageOAuth2RedirectFailure />} />

          {/* Public Record Action Routes */}
          <Route path="/_pb/records/password-reset/:token" element={<PageRecordConfirmPasswordReset />} />
          <Route path="/_pb/records/verification/:token" element={<PageRecordConfirmVerification />} />
          <Route path="/_pb/records/email-change/:token" element={<PageRecordConfirmEmailChange />} />

          {/* Private Routes (require authentication) */}
          <Route path="/" element={<PrivateRoute><Navigate to="/collections" replace /></PrivateRoute>} />
          <Route path="/collections" element={<PrivateRoute><PageCollections /></PrivateRoute>} />
          <Route path="/collections/:collectionIdOrName" element={<PrivateRoute><PageRecords /></PrivateRoute>} />
          <Route path="/collections/:collectionIdOrName/records/create" element={<PrivateRoute><PageRecordCreate /></PrivateRoute>} />
          <Route path="/collections/:collectionIdOrName/records/:recordId" element={<PrivateRoute><PageRecordView /></PrivateRoute>} />
          <Route path="/collections/:collectionIdOrName/records/:recordId/edit" element={<PrivateRoute><PageRecordEdit /></PrivateRoute>} />

          <Route path="/settings" element={<PrivateRoute><PageSettings /></PrivateRoute>} />
          <Route path="/logs" element={<PrivateRoute><PageLogs /></PrivateRoute>} />

          <Route path="/admins" element={<PrivateRoute><PageAdmins /></PrivateRoute>} />
          <Route path="/admins/create" element={<PrivateRoute><PageAdminCreate /></PrivateRoute>} />
          <Route path="/admins/:adminId" element={<PrivateRoute><PageAdminEdit /></PrivateRoute>} />

          {/* Not Found Route */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default RouterConfig;
