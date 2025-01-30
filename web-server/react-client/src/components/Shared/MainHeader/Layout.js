import React, { useState, useEffect } from "react";
import MainHeader from "./MainHeader";
import { Outlet } from "react-router-dom";
import { getUserProfile } from "../../../services/api";

const Layout = () => {
    const [display_name, setDisplayName] = useState(null);
    const [picture, setPicture] = useState(null);

    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userData = await getUserProfile(userId);
                setDisplayName(userData.display_name);
                setPicture(userData.picture);
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }
        }

        if (token) {
            fetchUserProfile();
        }
    }, [token]);

    return (
        <>
            <MainHeader username={display_name} profilePicture={picture} />
            <div>
                <Outlet /> {/* Render nested routes here */}
            </div>
        </>
    );
};

export default Layout;
