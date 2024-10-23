"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import axios from "axios";

const Balance = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [balance, setBalance] = useState(0); // Set initial balance to 0
  const [rate, setRate] = useState(0); // Rate per hour
  const [checkInTimestamp, setCheckInTimestamp] = useState(null);
  const [currentTimestamp, setCurrentTimestamp] = useState(null);
  const [showNoCheckInPopup, setShowNoCheckInPopup] = useState(false);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState("/default-profile.png");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        if (email) {
          const response = await axios.get(`http://localhost:5000/user/${email}`);
          if (response.data) {
            setUserData(response.data);
            setRate(response.data.rate);
            setProfileImage(
              response.data.profileImage.startsWith("http")
                ? response.data.profileImage
                : `http://localhost:5000${response.data.profileImage}`
            );
          }
        }
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };

    fetchUserData();

    const storedIsCheckedIn = localStorage.getItem("isCheckedIn");
    const storedTimestamp = localStorage.getItem("timestamp");
    if (storedIsCheckedIn === "true" && storedTimestamp) {
      setIsCheckedIn(true);
      setCheckInTimestamp(storedTimestamp);
    } else {
      setIsCheckedIn(false);
    }
  }, []);

  const handleCheckBalance = () => {
    if (isCheckedIn && checkInTimestamp) {
      const income = calculateIncome(checkInTimestamp);
      setBalance(income);
      setCurrentTimestamp(new Date().toLocaleString());
      setShowPopup(true);
    } else {
      setShowNoCheckInPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleCloseNoCheckInPopup = () => {
    setShowNoCheckInPopup(false);
  };

  const calculateIncome = (checkInTimestamp) => {
    const checkInTime = new Date(checkInTimestamp);
    const currentTime = new Date();
    const minutesWorked = Math.abs(currentTime - checkInTime) / 60000;
    let effectiveRate = rate;

    // Check if worked more than 8 hours
    if (minutesWorked > 480) {
      effectiveRate += 10;
    }

    const income = (minutesWorked / 60) * effectiveRate;
    return parseFloat(income.toFixed(2));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto mt-3 p-8 flex items-center justify-center">
        <div className="bg-gray-200 p-8 rounded-lg w-full max-w-2xl text-center">
          <div className="w-40 h-40 bg-gray-300 rounded-full mx-auto mb-6 overflow-hidden flex items-center justify-center">
            <Image
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
              width={150}
              height={150}
              loading="eager"
            />
          </div>
          <h2 className="text-3xl font-bold mb-6">Balance</h2>
          <button
            onClick={handleCheckBalance}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Check Balance
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-sm w-full text-center relative">
            <button
              onClick={handleClosePopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">Your balance</h2>
            <p className="text-gray-600 whitespace-nowrap">{balance} Baht</p>
            <p className="text-gray-600 whitespace-nowrap mt-2">
              Checked in at: {new Date(checkInTimestamp).toLocaleString()}
            </p>
            <p className="text-gray-600 whitespace-nowrap">
              Checked balance at: {currentTimestamp}
            </p>
          </div>
        </div>
      )}

      {showNoCheckInPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-sm w-full text-center relative">
            <button
              onClick={handleCloseNoCheckInPopup}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4">No Check-In Record</h2>
            <p className="text-gray-600">
              Please check in first before checking your balance.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Balance;
