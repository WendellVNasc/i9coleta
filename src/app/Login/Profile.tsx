import React, { useEffect, useState } from "react";

interface ProfileSelectionProps {
  setProfile: (profileId: string) => void;
}

const ProfileSelection: React.FC<ProfileSelectionProps> = ({ setProfile }) => {
  const [selectedProfileId, setSelectedProfileId] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/me");
        const data = await response.json();
        // Assuming the response data contains an array of profiles
        // You can modify this part based on the actual response structure
        const profiles = data.profiles;
        // Update the selected profile with the first profile in the array
        setSelectedProfileId(profiles[0].id);
        setProfile(profiles[0].id);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileSelection = (profileId: string) => {
    setSelectedProfileId(profileId);
    setProfile(profileId);
  };

  return (
    <div>
      <h2>Select a Profile</h2>
      <button onClick={() => handleProfileSelection("profile1")}>
        Profile 1
      </button>
      <button onClick={() => handleProfileSelection("profile2")}>
        Profile 2
      </button>
      <button onClick={() => handleProfileSelection("profile3")}>
        Profile 3
      </button>
    </div>
  );
};

export default ProfileSelection;
