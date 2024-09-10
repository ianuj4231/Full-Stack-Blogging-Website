import  { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { emailState, passwordState, nameState } from '../recoil/atoms';
import { useNavigate } from 'react-router-dom';
import { backend_url } from '../config';
const baseUrl = backend_url ;
import { signupSchema } from '@ianuj4231/blogging-website-2024-common';
import { toast } from 'react-toastify';
import axios from 'axios';
export function SignupFinal(): JSX.Element {
    const [email, setEmail] = useRecoilState(emailState);
    const [password, setPassword] = useRecoilState(passwordState);
    const [name, setName] = useRecoilState(nameState);
    const navigate = useNavigate();

    useEffect(() => {
        const otpValidated = localStorage.getItem("otpValidated") === "true";
        if (!otpValidated) {
          navigate('/signup');
        }
      }, []);
      
    useEffect(() => {
        const storedEmail = localStorage.getItem("email");
        if (storedEmail) {
            setEmail(storedEmail);
        }
    }, []);

    async function handleClick(){


        const result = signupSchema.safeParse({email, password, name});

        if (!result.success) {
            const errors = result.error.errors;
            const errorMessages = errors.map(err => err.message).join(' ');
            toast.error(`Input validation error - password: ${errorMessages}`);
            return;
        }

        try {
            const response =  await axios.post(`${baseUrl}/api/v1/user/signupFinal`, { email , password, name  });  
            
            // if(response.status ===200 && response.data.message==="User with this email already exists"){
            //     toast.error("User with this email already exists");
            //     return;
            // }
            
            toast.success('Signup successful!');
            localStorage.setItem("token", response.data.token)            
            navigate("/getAllBlogs")
        } catch (error: any) {
            if(error.response.status ===401 ){
                toast.error(  "User with this email already exists");
            }
            else toast.error('An error occurred. Please try again.');
        }
    }
    
    return (
        <div>
            <input
                type="email"
                value={email}
                readOnly
                placeholder="Email"
            />

            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />

            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
            />

            <button onClick={handleClick}  >
                        sign up
            </button>
        </div>
    );

    return <> {

    }</>
}