"use client";

import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import Image from "next/image";

const Profile = () => {
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showEditImagePopup, setShowEditImagePopup] = useState(false);
  const [profileImage, setProfileImage] = useState("/default-profile.png");
  const [totalIncome, setTotalIncome] = useState(() => {
    return parseFloat(localStorage.getItem("totalIncome") || "0");
  });

  const handleEditPassword = () => {
    setShowPasswordPopup(true);
  };

  const handleClosePasswordPopup = () => {
    setShowPasswordPopup(false);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSavePassword = () => {
    if (newPassword === confirmPassword) {
      // Save password logic here
      handleClosePasswordPopup();
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

  const handleSaveImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
    handleCloseEditImagePopup();
  };
  
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <Navbar />
      <div className="container mx-auto p-8 text-center">
        <div className="flex flex-col items-center">
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-5">PAKKHAPHON SAEKOW</h2>

            <div className="w-40 h-40 bg-gray-300 rounded-full mb-4 overflow-hidden flex items-center justify-center">
              <Image
                src={profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
                width={150}
                height={150}
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
              <ul className="space-y-4">
                <li>
                  <span className="font-semibold">First name: </span>Pakkhapol
                </li>
                <li>
                  <span className="font-semibold">Last name: </span>Saekow
                </li>
                <li>
                  <span className="font-semibold">Phone number: </span>
                  063-020-7740
                </li>
                <li>
                  <span className="font-semibold">Date of birth: </span>
                  06-12-2003
                </li>
                <li>
                  <span className="font-semibold">Start date: </span>xxxx
                </li>
                <li>
                  <span className="font-semibold">Rate: </span>80 Baht/Hrs
                </li>
                <li>
                  <span className="font-semibold">Total income: </span>
                  {totalIncome} Baht
                </li>
                <li>
                  <span className="font-semibold">Email: </span>
                  Pakkhapol2444@gmail.com
                </li>
                <li className="flex items-center justify-center">
                  <span className="font-semibold">Password: </span>
                  <span className="ml-2">1234578</span>
                  <button
                    onClick={handleEditPassword}
                    className="ml-4 text-blue-500 hover:underline"
                  >
                    Edit
                  </button>
                </li>
              </ul>
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
                    {JSON.parse(
                      localStorage.getItem("checkInOutHistory") || "[]"
                    ).map((entry, index) => (
                      <tr key={index}>
                        <td className="border-b p-2">{entry.action}</td>
                        <td className="border-b p-2">{entry.timestamp}</td>
                      </tr>
                    ))}
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
