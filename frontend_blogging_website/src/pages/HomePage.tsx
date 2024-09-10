import { useNavigate } from 'react-router-dom';
import "../App.css"

export function HomePage(): JSX.Element {
    const navigate = useNavigate();

    function handleSubmitSignup() {
        navigate('/signupEnterEmail');
    }

    

    function handleSubmitSignin() {
        navigate("/signin")
    }

    return <> {
        <div>
            <div className='button-container-home-page'>


                <span>
                    <button onClick={handleSubmitSignin} > signin </button>

                </span>
                <button onClick={handleSubmitSignup}> signup </button>

                <span>

                </span>

            </div>




            <div className="center-container">
                Blogging website
            </div>
        </div>
    }</>
}