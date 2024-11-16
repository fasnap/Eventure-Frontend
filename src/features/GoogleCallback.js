import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "./authSlice";

const GoogleCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // Get the query parameter 'code' from the URL
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");

    if (code) {
      // Exchange the code for an access token
      axios
        .post("http://127.0.0.1:8000/dj-rest-auth/google/", { code })
        .then((response) => {
          console.log("Google login success:", response.data);
          // Handle successful login
          const { accessToken, refreshToken, user } = response.data;
          dispatch(
            loginSuccess({
              user,
              accessToken,
              refreshToken,
            })
          );
          // Redirect user to the appropriate page
          //   if (user.user_type === "attendee") {
          console.log("User type:", user.user_type);

          navigate("/attendee/profile");
          //   } else if (user.user_type === "creator") {
          // navigate("/creator/profile");
          //   }
        })
        .catch((error) => {
          console.error("Google login error:", error);
        });
    }
  }, [location, navigate, dispatch]);

  return <div>Loading...</div>;
};

export default GoogleCallback;
