import { useState } from "react";
import { useLocation } from "react-router-dom";


const LoginPage = ({}) => {
    const location = useLocation();

    const [username, setUsername] = useState(location.state?.username || "");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <div> 
            <h1> Sign In</h1>
            <form onSubmit={handleSubmit}> 
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                <input type="submit" value="Get Started"/>
            </form>
        </div>

    )
}
export default LoginPage;
