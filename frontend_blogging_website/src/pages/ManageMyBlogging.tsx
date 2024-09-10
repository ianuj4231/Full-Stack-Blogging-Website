import axios from "axios";
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import "../App.css"
import { backend_url } from "../config";
import { toast } from "react-toastify";
import { blogState } from "../recoil/atoms";
import { useRecoilState } from 'recoil';
import { postsofoneState } from "../recoil/atoms";
import Swal from 'sweetalert2';

interface Post {
    id: number;
    title: string;
    content: string;
}

export function ManageMyBlogging() {
    const navigate = useNavigate();
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [openInputBox, setOpenInputBox] = useState(false);
    const [postsofone, setPostsofone] = useRecoilState(postsofoneState);
    const [blog, setBlog] = useRecoilState(blogState);
    const [editPost, setEditPost] = useState({ content: "", title: "" });
    const [editingPostId, setEditingPostId] = useState<number | null>(null);
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            toast.error('Session expired. Please log in again.');
            navigate("/signin");
        }
        else {
            console.log(token);

            const base64Url = token.split('.')[1];
            const jsonPayload = decodeURIComponent(atob(base64Url).split('').map(function (c) {
                return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
            }).join(''));
            const decoded = JSON.parse(jsonPayload);
            console.log(decoded);

            const now = Date.now() / 1000;

            if (now > decoded.exp) {
                localStorage.removeItem('token');
                toast.error('Session expired. Please log in again.');
                setTimeout(() => navigate("/signin"), 0);
            }
            else {
                setIsTokenValid(true);
            }
        }
    },)

    async function getPostsOfOne() {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${backend_url}/api/v1/user/getPostsofOneAuthor`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            const posts = response.data.postsOfOne;
            setPostsofone(posts);
        } catch (error) {
            toast.error(" Failed to fetch posts ")
        }
    }

    useEffect(() => {
        console.log("componenet mounting");
        if (isTokenValid) {
            getPostsOfOne();
        }
    }, [isTokenValid])

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        const { name, value } = e.target;

        setBlog(prevBlog => ({
            ...prevBlog,
            [name]: value
        }));

    }



    async function handleDelete(id: number) {
        try {
            await axios.delete(`${backend_url}/api/v1/user/deleteBlog/${id}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`                }
            });
            toast.success("blog deleted");
            setPostsofone((prev) => prev.filter((blog: Post) => blog.id !== id));
        }
        catch (error) {
            toast.error("unable to delete blog now... pls try later")
        }
    }


    async function handleSubmit(e: any) {
        e.preventDefault();
        try {
            await axios.post(`${backend_url}/api/v1/user/blog`, blog, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem("token")}`,
                }
            });
            console.log("Blog post submitted successfully.");
            toast.success("Blog post submitted successfully.")
            getPostsOfOne();
            setBlog({ title: "", content: "" })
        } catch (error) {
            toast.error("Failed to submit blog post. Please try again.");
        }
    }



    return <>
        {
            <div>

                <span>
                    <button onClick={() => setOpenInputBox(!openInputBox)}>
                        {openInputBox ? 'Cancel' : 'Write New Blog'}
                    </button>
                </span>

                <br></br>
                <br></br>


                <div >
                    {
                        openInputBox &&

                        <form onSubmit={handleSubmit}>
                            <input
                                onChange={handleChange}
                                name="title"
                                value={blog.title}
                                placeholder="Enter title"
                                required
                            />
                            <input
                                onChange={handleChange}
                                name="content"
                                value={blog.content}
                                placeholder="Enter content"
                                required
                            />
                            <button type="submit">Submit</button>
                        </form>
                    }

                </div>
                <br></br>
                <br></br>


                <div className="blog-post" style={{ fontStyle: "bold" }} >  your previous blogs will displayed here </div>


                {
                    postsofone.length ?

                        <>

                            {

                                postsofone.map((post: Post) => (

                                    <div key={post.id} className="blog-post">

                                        {
                                            editingPostId === post.id ?

                                                <>

                                                    <input onChange={(e) => {
                                                        setEditPost(prev => ({ ...prev, title: e.target.value }))
                                                    }} type="text" name="title" value={editPost.title} />


                                                    <input onChange={(e) => {
                                                        setEditPost(prev => ({ ...prev, content: e.target.value }))
                                                    }} type="text" name="content" value={editPost.content} />
                                                    <br></br>
                                                    <br></br>
                                                    <button onClick={async () => {
                                                        try {
                                                            const response = await axios.put(`${backend_url}/api/v1/user/editBlog/${post.id}`,
                                                                {
                                                                    title: editPost.title,
                                                                    content: editPost.content
                                                                },
                                                                {
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                                                                    }
                                                                });
                                                            toast.success("updation success")
                                                            console.log(response.data);
                                                            setEditingPostId(null)
                                                            getPostsOfOne();
                                                            setEditPost({ title: "", content: "" })
                                                        } catch (error) {
                                                            toast.error("error, unable to submit updation")
                                                        }

                                                    }}>
                                                        submit updation
                                                    </button>
                                                    <br></br><br></br>
                                                    <button onClick={() => {
                                                        setEditingPostId(null)
                                                    }} > cancel
                                                    </button>




                                                </>

                                                :
                                                <div> <h2>{post.title}</h2>
                                                    <p>{post.content}</p>
                                                    <button onClick={() => {
                                                        setEditingPostId(post.id)
                                                        setEditPost(post)
                                                    }

                                                    }> update </button>
                                                </div>

                                        }
                                        <br></br><br></br>
                                        <button onClick={async () => 
                                            
                                            {
                                                // const isConfirmed = window.confirm("Are you sure you want to delete this post?");
                                                
                                                const { isConfirmed } = await Swal.fire({
                                                    title: 'Are you sure u want to delgte this blog?',
                                                    text: "You won't be able to revert this!",
                                                    icon: 'warning',
                                                    showCancelButton: true,
                                                    confirmButtonColor: '#d33',
                                                    cancelButtonColor: '#3085d6',
                                                    confirmButtonText: 'Yes, delete it!',
                                                    cancelButtonText: 'No, cancel!',
                                                });
                                            
                                                if (!isConfirmed) return;
                                            
                                                
                                                if (!isConfirmed) return;


                                                handleDelete(post.id)
                                            }
                                          }> delete</button>

                                    </div>
                                ))

                            }
                        </>

                        : <div> you did not create any blogs yet... </div>


                }
                <br></br>


            </div>
        }</>
}
