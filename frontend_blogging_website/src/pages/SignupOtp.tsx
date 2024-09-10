import axios from 'axios';
import React, { useState, ChangeEvent, MouseEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { backend_url } from '../config';
import { useLocation } from 'react-router-dom';
const baseUrl = backend_url ;
import { toast } from 'react-toastify';

export function SignupOtp(): JSX.Element   {
    
    const location = useLocation();
    const { email } = location.state||{};

    const [otp, setOtp] = useState<string>('');
    const navigate = useNavigate();
    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setOtp(e.target.value);
    }
    async function handleSubmit(e:MouseEvent<HTMLButtonElement>){
        e.preventDefault();
        const otp2= Number(otp)
        try {
            const response=  await axios.post(`${baseUrl}/api/v1/user/verify-otp`, { email , otpPurpose: "email_verification",otp: otp2 });
            if (response.status === 200){
                toast.success('OTP is valid');
                localStorage.setItem("email", email);
                localStorage.setItem("otpValidated", "true"); 
                await new Promise((r)=>setTimeout(r, 1000)); 
                navigate('/signupFinal');
            }else{
                 toast.error('OTP expired or invalid');
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                console.error('Error response data:', error.response.data.message);
                toast.error(`Error: ${error.response.data.message}`);
            } else {
                console.error('Error:', error.message);
                toast.error(`Error: ${error.message}`);
            }
        }
    }
    return <> { 
            <div>
                  <div>
                  Enter OTP sent to your email: {email}
                  </div>

                                    <input 
                                    type="text" 
                                    placeholder="Enter OTP" 
                                    value={otp} 
                                    onChange={handleChange} 
                                    className="otp-input"
                                />
                    <button onClick={handleSubmit}>
                         verify otp
                    </button>
            </div>
    }</>
}