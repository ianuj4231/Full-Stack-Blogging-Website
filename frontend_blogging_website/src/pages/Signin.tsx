import { useRecoilState } from 'recoil';
import React, { useEffect } from 'react';
import { emailState, passwordState, nameState } from '../recoil/atoms';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

import { backend_url } from '../config';
const baseUrl = backend_url;
export function Signin(): JSX.Element {
    const navigate  =  useNavigate();
      
    const [email, setEmail] = useRecoilState(emailState);
    const [password, setPassword] = useRecoilState(passwordState);
    async function handleSignin() {

        try {
            const response  = await axios.post(`${baseUrl}/api/v1/user/signin`, { email , password });
            toast.success("signin success");
            await new Promise((r)=> setTimeout(r, 1000));
            const token = response.data.token;
            localStorage.setItem("token", token);
            navigate("/getAllBlogs");
        } catch (error) {
            toast.error('sign in failed');
        }
    }

   async function handlefp() {
            navigate("/forgotPasswordOTP_Page")
   }
    return <>{
        <div>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />
            <button  onClick={handleSignin} > sign in </button>
             --or--  
             <button  onClick={handlefp} > forgot password </button>
        </div>
    }

    </>

}