"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

const Profile = () => {
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showEditImagePopup, setShowEditImagePopup] = useState(false);
  const [profileImage, setProfileImage] = useState("/default-profile.png");
  const [totalIncome, setTotalIncome] = useState(0);
  const [userData, setUserData] = useState(null);
  const [checkInOutHistory, setCheckInOutHistory] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const email = localStorage.getItem("userEmail");
    const password = localStorage.getItem("userPassword");

    if (!token || !email || !password) {
      router.push("/auth");
    } else {
      fetchUserData(email, password);
      fetchCheckInOutHistory(email);
    }
  }, [router]);

  async function fetchUserData(email, password) {
    try {
      const response = await axios.get("http://localhost:5000/user");
      const users = response.data;
      const matchedUser = users.find(
        (user) => user.email === email && user.password === password
      );
      if (matchedUser) {
        setUserData(matchedUser);
        setProfileImage(
          matchedUser.profileImage.startsWith("http")
            ? matchedUser.profileImage
            : `http://localhost:5000${matchedUser.profileImage}`
        );
        setTotalIncome(matchedUser.total);
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error fetching user data: ", error);
    }
  }

  async function fetchCheckInOutHistory(email) {
    try {
      const response = await axios.get(
        `http://localhost:5000/history?email=${email}`
      );
      setCheckInOutHistory(response.data);
    } catch (error) {
      console.error("Error fetching check-in/out history: ", error);
    }
  }

  const handleEditPassword = () => {
    setShowPasswordPopup(true);
  };

  const handleClosePasswordPopup = () => {
    setShowPasswordPopup(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSavePassword = async () => {
    if (newPassword === confirmPassword) {
      try {
        const email = localStorage.getItem("userEmail");
        if (email) {
          await axios.put("http://localhost:5000/user/password", {
            email,
            oldPassword,
            newPassword,
          });
          handleClosePasswordPopup();
        }
      } catch (error) {
        console.error("Error saving password: ", error);
        alert("Failed to update password");
      }
    } else {
      alert("New password and confirm password do not match");
    }
  };

  const handleEditImage = () => {
    setShowEditImagePopup(true);
  };

  const handleCloseEditImagePopup = () => {
    setShowEditImagePopup(false);
  };

  const handleSaveImage = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("profileImage", file);
      const email = localStorage.getItem("userEmail");

      try {
        if (email) {
          const response = await axios.put(
            "http://localhost:5000/user/image",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              params: {
                email,
              },
            }
          );

          const updatedProfileImage = response.data.profileImage.startsWith(
            "http"
          )
            ? response.data.profileImage
            : `http://localhost:5000${response.data.profileImage}`;

          setProfileImage(updatedProfileImage);
          localStorage.setItem("userProfileImage", updatedProfileImage);
        }
      } catch (error) {
        console.error("Error saving profile image: ", error);
        alert("Failed to update profile image");
      }
    }
    handleCloseEditImagePopup();
  };

  useEffect(() => {
    const savedProfileImage = localStorage.getItem("userProfileImage");
    if (savedProfileImage) {
      setProfileImage(
        savedProfileImage.startsWith("http")
          ? savedProfileImage
          : `http://localhost:5000${savedProfileImage}`
      );
    }
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return (
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date.getDate()).slice(-2) +
      "-" +
      date.getFullYear()
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <div className="container mx-auto p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-5">
              {userData
                ? `${userData.firstName} ${userData.lastName}`
                : "Loading..."}
            </h2>

            <div className="w-40 h-40 bg-gray-300 rounded-full mb-4 overflow-hidden flex items-center justify-center">
              <Image
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
                width={150}
                height={150}
                loading="eager"
              />
            </div>
            <button
              onClick={handleEditImage}
              className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 mt-5 text-sm"
            >
              Change Picture
            </button>
          </div>
          <div className="w-full md:w-2/3 mt-8 md:mt-0">
            <div className="mx-auto mt-8 text-center">
              <div className="border-b-2 border-gray-300 my-6"></div>
              <h3 className="text-3xl font-semibold mb-6">About</h3>
              {userData ? (
                <ul className="space-y-4">
                  <li>
                    <span className="font-semibold">First name: </span>
                    {userData.firstName}
                  </li>
                  <li>
                    <span className="font-semibold">Last name: </span>
                    {userData.lastName}
                  </li>
                  <li>
                    <span className="font-semibold">Phone number: </span>
                    {userData.phone}
                  </li>
                  <li>
                    <span className="font-semibold">Date of birth: </span>
                    {formatDate(userData.birth)}
                  </li>
                  <li>
                    <span className="font-semibold">Start date: </span>
                    {formatDate(userData.startDate)}
                  </li>
                  <li>
                    <span className="font-semibold">Rate: </span>
                    {userData.rate} Baht/Hrs
                  </li>
                  <li>
                    <span className="font-semibold">Total income: </span>
                    {userData.total} Baht
                  </li>
                  <li>
                    <span className="font-semibold">Email: </span>
                    {userData.email}
                  </li>
                  <li className="flex items-center justify-center">
                    <span className="font-semibold">Password: ******</span>
                    <button
                      onClick={handleEditPassword}
                      className="ml-4 text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                  </li>
                </ul>
              ) : (
                <p>Loading user data...</p>
              )}
              <div className="border-b-2 border-gray-300 my-6"></div>
              <h3 className="mt-10 text-3xl font-semibold mb-4">
                Check In/Out History
              </h3>
              <div className="mt-4 max-h-60 overflow-y-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b-2 p-2">Action</th>
                      <th className="border-b-2 p-2">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {checkInOutHistory.length > 0 ? (
                      checkInOutHistory.map((entry, index) => (
                        <tr key={index}>
                          <td className="border-b p-2">{entry.action}</td>
                          <td className="border-b p-2">
                            {new Date(entry.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2" className="border-b p-2 text-center">
                          No history available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPasswordPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-sm w-full text-center relative">
            <button
              onClick={handleClosePasswordPopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6">Edit Password</h2>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
              placeholder="Enter old password"
            />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
              placeholder="Enter new password"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
              placeholder="Confirm new password"
            />
            <button
              onClick={handleSavePassword}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Save Password
            </button>
          </div>
        </div>
      )}

      {showEditImagePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-sm w-full text-center relative">
            <button
              onClick={handleCloseEditImagePopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6">Edit Profile Picture</h2>
            <input
              type="file"
              onChange={handleSaveImage}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
