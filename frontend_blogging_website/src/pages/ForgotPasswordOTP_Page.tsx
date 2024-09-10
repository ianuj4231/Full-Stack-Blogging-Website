import  {  useState } from 'react';
import {  useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import { backend_url } from '../config';
const baseUrl = backend_url;

export function ForgotPasswordOTP_Page(): JSX.Element {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    async function handleClick() {
        try {
             await axios.post(`${baseUrl}/api/v1/user/forgotPassword`, { email });
            toast.success("a 5-min valid OTP is  sent to your mail")
            setOtpSent(true);
        } catch (error) {
            toast.error("Failed to send OTP. Please try again.");
        }
    }
    const navigate =  useNavigate();

    async function handleVerifyOtp() {
        const otpPurpose  ="set_new_password";
        const otp2 = Number(otp);
        console.log(         typeof(otp2)    );
        try {
            const response = await axios.post(`${baseUrl}/api/v1/user/verify-otp`, { email , otpPurpose, otp:  otp2});
            if(response.status==200){
                    localStorage.setItem("forgotPasswordOTP_isValid", "true");
                    localStorage.setItem("email_password_forgot", email);

                    toast.success("otp is valid");
                    navigate('/resetPasswordPage');
                }else{
                        toast.error("OTP is invalid or expired. Please try again")
            }
        } catch (error) {
             toast.error("OTP is invalid or expired. Please try again")
        }
    }

    return <>
        {
            <div>
                enter email to get otp to set a new password--
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="enter Email"
                />


                <button onClick={handleClick}> --get otp </button>
                <br></br>
                {
                    otpSent  &&  <div>
                    <p>Enter the OTP sent to your email:</p>
                    <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Enter OTP"
                    />
                    <button onClick={handleVerifyOtp}>Verify OTP</button>
                </div>
                }
            </div>

        }</>
}