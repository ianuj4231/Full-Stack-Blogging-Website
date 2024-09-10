import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignupEnterEmail } from './pages/SignupEnterEmail';
import { SignupFinal } from './pages/SignupFinal';
import { SignupOtp } from "./pages/SignupOtp";
import { HomePage } from "./pages/HomePage";
import { Signin } from './pages/Signin';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RecoilRoot } from 'recoil';
import { ForgotPasswordOTP_Page } from './pages/ForgotPasswordOTP_Page';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { GetAllBlogs } from './pages/GetAllBlogs';
import { ManageMyBlogging } from './pages/ManageMyBlogging';
function App() {
  return (
    <>
      <RecoilRoot>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/signupEnterEmail" element={<SignupEnterEmail />} />
          <Route path="/signupFinal" element={<SignupFinal />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/signupOtp" element={<SignupOtp />} />
          <Route path="/forgotPasswordOTP_Page" element={<ForgotPasswordOTP_Page />} />
          <Route path="/resetPasswordPage" element={<ResetPasswordPage />} />
          <Route path="/getAllBlogs" element={<GetAllBlogs />} />
          <Route path="/handleManage" element={<ManageMyBlogging /> }  />
        </Routes>
      </BrowserRouter>
      </RecoilRoot>
    </>
  );
}

export default App;
