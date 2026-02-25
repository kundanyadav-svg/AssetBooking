import { useEffect } from 'react';
import axios from "axios";
import {useDispatch} from "react-redux";
import {setuserData} from "../redux/userSlice.js";

let hasFetchedProfile = false;

const useUserProfile = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        if (hasFetchedProfile) return; // already fetched during this app session
        hasFetchedProfile = true;

        const fetchuserProfile = async () => {
            try {
                const response = await axios.get('http://localhost:8080/auth/profile', {
                    withCredentials: true
                });

                dispatch(setuserData(response.data));
                console.log("User Profile:", response.data);

            } catch (error) {
                console.error("Error fetching user profile:", error.response ? error.response.data :
                    error.message
                );
            }
        }

        fetchuserProfile();

    }, [dispatch]);
};

export default useUserProfile;
