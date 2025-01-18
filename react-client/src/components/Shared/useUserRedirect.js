import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useUserRedirect = (token) => {
    const navigate = useNavigate();
    const [isValidUser, setIsValidUser] = useState(!!token);

    useEffect(() => {
        if (!token || token === "") {
            navigate("/");
            setIsValidUser(false);
        } else {
            setIsValidUser(true);
        }
    }, [token, navigate]);

    return isValidUser;
};

export default useUserRedirect;
