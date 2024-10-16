"use client";

import React, { useState } from 'react';
import Navbar from '../Components/Navbar';

const Profile = () => {
    const [showPasswordPopup, setShowPasswordPopup] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showEditImagePopup, setShowEditImagePopup] = useState(false);

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

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="container mx-auto p-8">
                <h1 className="text-4xl font-bold mb-8">Personal Information</h1>
                <div className="border-b border-gray-300 mb-8"></div>
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/3 flex flex-col items-center">
                        <div className="w-40 h-40 bg-gray-300 rounded-full mb-4 overflow-hidden flex items-center justify-center">
                            {/* Placeholder for image from Database */}
                            <img src="https://via.placeholder.com/150" alt="Profile" className="w-full h-full object-cover" />
                        </div>
                        <button onClick={handleEditImage} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Change Picture</button>
                        <h2 className="text-2xl font-bold mt-4 mb-2">First Last</h2>
                        <p className="text-gray-600">Position Title</p>
                    </div>
                    <div className="w-full md:w-2/3 mt-8 md:mt-0">
                        <div className="ml-0 md:ml-8">
                            <h3 className="text-3xl font-semibold mb-6">About</h3>
                            <ul className="space-y-4">
                                <li>
                                    <span className="font-semibold">First name: </span>xxxxx
                                </li>
                                <li>
                                    <span className="font-semibold">Last name: </span>xxxxx
                                </li>
                                <li>
                                    <span className="font-semibold">Phone number: </span>xxxxxx
                                </li>
                                <li>
                                    <span className="font-semibold">Date of birth: </span>mm-dd-yyyy
                                </li>
                                <li>
                                    <span className="font-semibold">Start date: </span>xxxxx
                                </li>
                                <li>
                                    <span className="font-semibold">Rate: </span>xxxxx
                                </li>
                                <li>
                                    <span className="font-semibold">Total income: </span>xxxxx
                                </li>
                                <li>
                                    <span className="font-semibold">Email: </span>Email address
                                </li>
                                <li className="flex items-center">
                                    <span className="font-semibold">Password: </span>
                                    <span className="ml-2">************</span>
                                    <button onClick={handleEditPassword} className="ml-4 text-blue-500 hover:underline">Edit</button>
                                </li>
                            </ul>
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
                            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:border-gray-500"
                        />
                        <button
                            onClick={handleCloseEditImagePopup}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Save Picture
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Profile;
