import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import "./LandingPage.css";

const LandingPage = ({}) => {
    const [username, setUsername] = useState("");
    
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        navigate('/signin', { state: { username }});
    };

    return (
        <div> 
            <h1> Ready to watch? Enter your username to create or restart your membership.</h1>
            <form onSubmit={handleSubmit}> 
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                <input type="submit" value="Get Started"/>
            </form>
        </div>

    )
}
export default LandingPage;