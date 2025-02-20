import { useState, useEffect, useRef } from "react";

const UserProfile = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const popupRef = useRef(null);

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch Profile Function
  const FetchProfile = async (e, profile) => {
    e.preventDefault();
    try {
      const response = await fetch(
        "https://chatapp-backend-g1ef.onrender.com/fetchprofile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: profile._id }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch user profile");
      }

      const userData = await response.json();
      console.log("Fetched User Data:", userData);
      setUserProfile(userData);
      setIsOpen(true);
    } catch (error) {
      console.log("Error fetching profile:", error);
    }
  };

  return (
    <div className="relative">
      {/* Profile Image (Click to Fetch) */}
      <div
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-cover bg-center border-2 border-white shadow-md transition-transform hover:scale-105 cursor-pointer"
        style={{
          backgroundImage: user?.profileImage
            ? `url(${user.profileImage})`
            : `url("/unknown-person-icon.webp")`,
        }}
        onClick={(e) => FetchProfile(e, user)}
      ></div>

      {/* Pop-up Box */}
      {isOpen && userProfile && (
        <div
          ref={popupRef}
          className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-200 p-4 z-50"
        >
          <div className="text-center">
            <img
              src={userProfile.profileImage || "/default-avatar.png"}
              alt="Profile"
              className="w-16 h-16 rounded-full mx-auto mb-2"
            />
            <h3 className="text-lg font-semibold">{userProfile.name}</h3>
            <p className="text-gray-500">{userProfile.email}</p>
          </div>
          <div className="mt-4 text-center">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
