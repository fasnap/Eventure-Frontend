import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCreatorProfile } from "../../api/auth";
import CreatorProfilePage from "./CreatorProfilePage";

function CreatorProfile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: creatorProfile, status } = useSelector(
    (state) => state.profile
  );
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCreatorProfile());
    }
  }, [dispatch, status]);
  useEffect(() => {
    if (creatorProfile && !creatorProfile.is_setup_submitted) {
      navigate("/creator/profile/setup");
    }
  }, [creatorProfile, navigate]);

  if (status === "failed") {
    return <div>Error loading profile. Please try again.</div>;
  }

  if (!creatorProfile) {
    return null; // Prevent rendering if data is not yet loaded
  }

  return <CreatorProfilePage creatorProfile={creatorProfile} />;
}

export default CreatorProfile;
