import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { backend_url } from '../config';
const baseUrl = backend_url;
import { signinSchema } from '@ianuj4231/blogging-website-2024-common';
import axios from 'axios';
import { passwordState } from '../recoil/atoms';

export function ResetPasswordPage() {
    const navigate = useNavigate();
    let email = localStorage.getItem("email_password_forgot");
    console.log("ResetPasswordPage email received is ", email);
    
    let forgotPasswordOTP_isValid = localStorage.getItem("forgotPasswordOTP_isValid");

    useEffect(() => {
        if (!forgotPasswordOTP_isValid) {
            navigate("/forgotPasswordOTP_Page");
        }
    }, []);

    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    async function handleSubmit(event: React.FormEvent) {
        event.preventDefault();

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match!");
        } else {
            console.log(newPassword);
            console.log(confirmPassword);

            try {
                const result = signinSchema.safeParse({ email, password: newPassword });
                if (!result.success) {
                    const errorMessages = result.error.errors.map(err => err.message).join(", ");
                    console.log(errorMessages);
                    toast.error(errorMessages);
                } else {
                    try {
                        const response = await axios.put(`${baseUrl}/api/v1/user/resetPassword`, {
                            email,
                           password:  newPassword,
                        });
                        console.log("Password updated successfully");
                        toast.success("Password updated successfully!");
                        localStorage.setItem("token", response.data.token);
                        navigate("/getAllBlogs");
                    } catch (error) {
                        toast.error("Try later. Server error.");
                    }
                }
            } catch (error) {
                toast.error("Try later. Server error.");
            }
        }
    }

    return (
        <div>
            <h1>Reset Password for {email}</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    required
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm Password"
                    required
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}
