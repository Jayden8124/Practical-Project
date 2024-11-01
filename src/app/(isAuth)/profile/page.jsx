"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

const Profile = () => {
  const [showEditImagePopup, setShowEditImagePopup] = useState(false);
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [totalIncome, setTotalIncome] = useState(0);
  const [userData, setUserData] = useState(null);
  const [checkInOutHistory, setCheckInOutHistory] = useState([]);
  const [showHistoryPopup, setShowHistoryPopup] = useState(false);
  const [filterAction, setFilterAction] = useState("All");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswordSuccessPopup, setShowPasswordSuccessPopup] = useState(false);
  const [showPasswordErrorPopup, setShowPasswordErrorPopup] = useState(false);
  const router = useRouter();

  const clearFormData = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const email = localStorage.getItem("userEmail");

    if (!token || !email) {
      router.push("/..");
    } else {
      fetchUserData(email);
      fetchCheckInOutHistory(email);
    }
  }, [router]);

  async function fetchUserData(email) {
    try {
      const response = await axios.get("http://localhost:5000/user");
      const users = response.data;
      const matchedUser = users.find((user) => user.email === email);
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
        `http://localhost:5000/history/${email}`
      );
      const data = response.data.map((entry) => {
        const dbTime = new Date(entry.time);
        const localTime = new Date(dbTime.getTime() + 7 * 60 * 60 * 1000); // add 7 hours (debug)
        return {
          ...entry,
          time: localTime,
        };
      });
      setCheckInOutHistory(
        data.sort((a, b) => new Date(b.time) - new Date(a.time))
      );
    } catch (error) {
      console.error("Error fetching check-in/out history: ", error);
    }
  }

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

  const handleChangePassword = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email || !oldPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all the fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    try {
      const response = await axios.put("http://localhost:5000/user/password", {
        email,
        oldPassword,
        newPassword,
      });

      if (response.status === 200) {
        setShowPasswordSuccessPopup(true);
        handleCloseChangePasswordPopup();
      }
    } catch (error) {
      console.error("Error updating password: ", error);
      setShowPasswordErrorPopup(true);
    }
  };

  const handleChangePasswordPopup = () => {
    setShowChangePasswordPopup(true);
  };

  const handleCloseChangePasswordPopup = () => {
    clearFormData();
    setShowChangePasswordPopup(false);
  };

  const handleClosePasswordSuccessPopup = () => {
    clearFormData();
    setShowPasswordSuccessPopup(false);
  };

  const handleClosePasswordErrorPopup = () => {
    clearFormData();
    setShowPasswordErrorPopup(false);
  };

  const handleEditImage = () => {
    setShowEditImagePopup(true);
  };

  const handleCloseEditImagePopup = () => {
    setShowEditImagePopup(false);
  };

  const handleShowHistory = () => {
    setShowHistoryPopup(true);
  };

  const handleCloseHistoryPopup = () => {
    setShowHistoryPopup(false);
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
      "/" +
      ("0" + date.getDate()).slice(-2) +
      "/" +
      date.getFullYear()
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-200 flex flex-col pt-24">
      <div className="container mx-auto p-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-center">
          <h1 className="text-3xl font-semibold mb-6">
            {userData ? `${userData.firstName} ${userData.lastName}` : "Loading..."}
          </h1>
          <div className="w-40 h-40 bg-gradient-to-b from-gray-400 to-gray-300 rounded-full mx-auto mb-6 overflow-hidden flex items-center justify-center">
            <Image
              src={profileImage}
              alt=""
              className="w-full h-full object-cover"
              width={150}
              height={150}
              loading="eager"
            />
          </div>
          <button
            onClick={handleEditImage}
            className="text-sm mt-3 bg-indigo-600 text-white px-4 py-2 rounded-xl font-medium shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-300 ease-in-out"
          >
            Change Picture
          </button>
        </div>
      </div>

      <div className="container mx-auto my-0 text-center mb-12">
        <div className="w-full md:w-1/2 mx-auto mt-8 text-center">
          {userData ? (
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <h3 className="text-3xl font-semibold mb-6">About</h3>
              <table className="w-full mx-auto text-left table-auto">
                <tbody>
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg shadow">
                    <td className="font-semibold p-4 text-black-800 bg-gray-180 rounded-l-lg">
                      First name:
                    </td>
                    <td className="p-4 bg-white rounded-r-lg border-l border-gray-200 shadow-inner">
                      {userData.firstName}
                    </td>
                  </tr>
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg shadow">
                    <td className="font-semibold p-4 text-black-800 bg-gray-180 rounded-l-lg">
                      Last name:
                    </td>
                    <td className="p-4 bg-white rounded-r-lg border-l border-gray-200 shadow-inner">
                      {userData.lastName}
                    </td>
                  </tr>
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg shadow">
                    <td className="font-semibold p-4 text-black-800 bg-gray-180 rounded-l-lg">
                      Email:
                    </td>
                    <td className="p-4 bg-white rounded-r-lg border-l border-gray-200 shadow-inner">
                      {userData.email}
                    </td>
                  </tr>
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg shadow">
                    <td className="font-semibold p-4 text-black-800 bg-gray-180 rounded-l-lg">
                      Phone:
                    </td>
                    <td className="p-4 bg-white rounded-r-lg border-l border-gray-200 shadow-inner">
                      {userData.phone}
                    </td>
                  </tr>
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg shadow">
                    <td className="font-semibold p-4 text-black-800 bg-gray-180 rounded-l-lg">
                      Birth:
                    </td>
                    <td className="p-4 bg-white rounded-r-lg border-l border-gray-200 shadow-inner">
                      {formatDate(userData.birth)}
                    </td>
                  </tr>
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg shadow">
                    <td className="font-semibold p-4 text-black-800 bg-gray-180 rounded-l-lg">
                      Start:
                    </td>
                    <td className="p-4 bg-white rounded-r-lg border-l border-gray-200 shadow-inner">
                      {formatDate(userData.startDate)}
                    </td>
                  </tr>
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg shadow">
                    <td className="font-semibold p-4 text-black-800 bg-gray-180 rounded-l-lg">
                      Rate:
                    </td>
                    <td className="p-4 bg-white rounded-r-lg border-l border-gray-200 shadow-inner">
                      {userData.rate} Baht/hr
                    </td>
                  </tr>
                  <tr className="bg-gradient-to-r from-gray-100 to-gray-200 p-4 rounded-lg shadow">
                    <td className="font-semibold p-4 text-black-800 bg-gray-180 rounded-l-lg">
                      Total income:
                    </td>
                    <td className="p-4 bg-white rounded-r-lg border-l border-gray-200 shadow-inner">
                      {userData.total} Baht
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="pt-10">
                <button
                  onClick={handleShowHistory}
                  className="mx-auto bg-gray-700 text-white px-5 py-2 rounded-lg font-medium text-base shadow-md hover:bg-gray-800 hover:shadow-lg transition-all duration-300 ease-in-out"
                >
                  History
                </button>
                <button
                  onClick={handleChangePasswordPopup}
                  className="mx-auto mt-3 ml-3 bg-red-600 text-white px-5 py-2 rounded-xl font-medium shadow-md hover:bg-red-700 hover:shadow-lg transition-all duration-300 ease-in-out"
                >
                  Change Password
                </button>
              </div>
            </div>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>

      {showChangePasswordPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-sm w-full text-center relative shadow-lg">
            <button
              onClick={handleCloseChangePasswordPopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6">Change Password</h2>
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
            />
            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
            />
            <button
              onClick={handleChangePassword}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {showPasswordSuccessPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-sm w-full text-center relative shadow-lg">
            <button
              onClick={handleClosePasswordSuccessPopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Password Updated</h2>
            <p className="text-gray-600">Your password has been updated successfully.</p>
          </div>
        </div>
      )}

      {showPasswordErrorPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-sm w-full text-center relative shadow-lg">
            <button
              onClick={handleClosePasswordErrorPopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Password Update Failed</h2>
            <p className="text-gray-600">Failed to update password. Please check your old password and try again.</p>
          </div>
        </div>
      )}

      {showEditImagePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-sm w-full text-center relative shadow-lg">
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

      {showHistoryPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 overflow-auto">
          <div className="bg-white p-8 rounded-lg max-w-lg w-full text-center relative shadow-lg">
            <button
              onClick={handleCloseHistoryPopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6">Check In/Out History</h2>
            <div className="mb-4">
              <select
                value={filterAction}
                onChange={(e) => setFilterAction(e.target.value)}
                className="p-2 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
              >
                <option value="All">All</option>
                <option value="Check In">Check In</option>
                <option value="Check Out">Check Out</option>
              </select>
            </div>
            <div className="overflow-x-auto max-h-80">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 border-b">Action</th>
                    <th className="py-2 border-b">Time</th>
                    <th className="py-2 border-b">Income (Baht)</th>
                  </tr>
                </thead>
                <tbody className="max-h-64 overflow-y-auto">
                  {checkInOutHistory
                    .filter(
                      (entry) =>
                        filterAction === "All" || entry.action === filterAction
                    )
                    .map((entry, index) => (
                      <tr key={index}>
                        <td className="py-2 border-b">{entry.action}</td>
                        <td className="py-2 border-b">
                          {new Date(entry.time).toLocaleString()}
                        </td>
                        <td className="py-2 border-b">{entry.income || "-"}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
