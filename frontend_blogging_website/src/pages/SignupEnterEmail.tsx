import React, { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import  { MouseEvent } from 'react';
import { backend_url } from '../config';
import { promises } from 'dns';
import { useNavigate } from 'react-router-dom';
const baseUrl = backend_url ;
export function SignupEnterEmail() : JSX.Element   {
   const navigate  = useNavigate();
    const [email, setEmail] = useState<string>('');

    function handleChange(e:ChangeEvent<HTMLInputElement>){
        setEmail(e.target.value);
    }

    async function handleSubmit(e:MouseEvent<HTMLButtonElement>){
        e.preventDefault();
        try {
            console.log(`${baseUrl}api/v1/user/signup`);
            const response  =await axios.post(`${baseUrl}/api/v1/user/signup`, { email });
            if(response.status == 401){
                toast.error("user already exists");
            }
            toast.success('otp sent to your email for verification!');
            navigate("/signupOtp", { state: { email } });


        } catch (error: any) {
            if (error.response && error.response.data) {
                console.error("Error response data:", error.response.data.message);
                toast.error(`Error: ${error.response.data.message}`);
            } else {
                console.error("Error:", error.message);
                toast.error(`Error: ${error.message}`);
            }
        }
    }

    return <> { 
        <div className="signup-center-container-enter-email">
  <span className="common-width signup-center-container-enter-email-text">
    Enter Email
  </span>
  
  <span className="common-width signup-center-container-enter-email-inputbox">
    <input type="email" placeholder="Enter email"   value={email} onChange={handleChange} />
  </span>

  <span className="common-width signup-center-container-enter-email-button">
        <button className="medium-button"   onClick={handleSubmit} >Get OTP</button>
      </span>
</div>

      
    }</>
}