import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useUserRedirect = (token) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!token || token === "") {
            navigate("/");
        }
    }, [token]);
};

export default useUserRedirect;
