import { toast } from 'react-toastify';
import { useRecoilValueLoadable } from 'recoil';
import { allBlogsSelector } from '../recoil/atoms';
import { useNavigate } from 'react-router-dom';

interface Blog {
    id: number;
    title: string;
    content: string;
   authorId: number
  }


export function GetAllBlogs(){
  const navigate =  useNavigate();

  
function handleManage(){
  navigate("/handleManage");
}
  
  const allBlogsLoadable = useRecoilValueLoadable(allBlogsSelector);
    
    
    switch (allBlogsLoadable.state) {
        case 'loading':
          return <div>Loading...</div>;
        case 'hasError':
          toast.error('Failed to fetch blogs.');
          return <div>Error loading blogs</div>;
        case 'hasValue':
          const allBlogs = allBlogsLoadable.contents;
          console.log("allBlogs ", allBlogs);
          

          return<>{ 
            
            <div>

                    <div className='inright'>
                            <button onClick={handleManage}> Manage My Blogging </button>
                    </div>


              {allBlogs.map((blog: Blog) => (
                <div key={blog.id}>
                  <h2>{blog.title}</h2>
                  <p>{blog.content}</p>
                </div>
              ))}
            </div>
            } </>
        default:
          return null;
      }
}