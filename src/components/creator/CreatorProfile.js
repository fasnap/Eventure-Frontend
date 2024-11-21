import React, { useEffect, useState } from "react";
import { getCreatorProfile } from "../../api/auth";
import CreatorProfilePage from "./CreatorProfilePage";
import { useNavigate } from "react-router-dom";

function CreatorProfile() {
  const [creatorProfile, setCreatorProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchCreatorProfile = async () => {
      try {
        const data = await getCreatorProfile();
        console.log("Fetched Data:", data); // Log the data
        setCreatorProfile(data);
        if (!data.is_setup_submitted) {
          navigate("/creator/profile/setup");
        }
      } catch (error) {
        console.error("Error fetching creator profile:", error);
        if (error.response?.status === 401) {
          console.log("Unauthorized access, please log in");
        }
      } finally {
        setLoading(false); 
      }
    };
    fetchCreatorProfile();
  }, [navigate]);
  if (loading) {
    return <div>Loading...</div>; // Loading state
  }

  if (!creatorProfile) {
    return <div>Error loading profile. Please try again.</div>; // Error state
  }
  return <CreatorProfilePage creatorProfile={creatorProfile} />;
}

export default CreatorProfile;