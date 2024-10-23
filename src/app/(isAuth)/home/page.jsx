"use client";

import React, { useState, useEffect } from "react";
import Footer from "../../Components/Footer";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Home() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [timestamp, setTimestamp] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("authToken"); // Check for token in local storage
    const email = localStorage.getItem("userEmail");
    const password = localStorage.getItem("userPassword");

    if (!token || !email || !password) {
      router.push("/auth"); // Redirect to login page if not authenticated
    } else {
      fetchData(email, password);
    }
  }, [router]);

  async function fetchData(email, password) {
    try {
      const response = await axios.get("http://localhost:5000/user");
      const users = response.data;
      const matchedUser = users.find(
        (user) => user.email === email && user.password === password
      );
      if (matchedUser) {
        setUserData(matchedUser);
      } else {
        console.error("User not found");
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  }

  useEffect(() => {
    fetchCheckInStatus();
  }, []);

  async function fetchCheckInStatus() {
    try {
      const savedCheckInStatus = localStorage.getItem("isCheckedIn");
      const savedTimestamp = localStorage.getItem("timestamp");
      if (savedCheckInStatus === "true") {
        setIsCheckedIn(true);
        setTimestamp(savedTimestamp);
      } else if (savedCheckInStatus === "false" && savedTimestamp) {
        setIsCheckedIn(false);
        setTimestamp(savedTimestamp);
      }
    } catch (error) {
      console.error("Error fetching check-in status: ", error);
    }
  }

  const handleCheckInOut = async () => {
    const currentTime = new Date().toISOString();
    const action = isCheckedIn ? "Check Out" : "Check In";

    if (isCheckedIn) {
      // Check Out
      const checkInTime = new Date(timestamp);
      const checkOutTime = new Date();
      const minutesWorked = Math.abs(checkOutTime - checkInTime) / 60000;
      let rate = userData.rate || 60; // Use user's rate if available

      // Increase rate by 10 if worked more than 8 hours
      if (minutesWorked > 480) {
        rate += 10;
      }

      const income = Math.round((minutesWorked / 60) * rate);

      // Save totalIncome to database
      try {
        await axios.put(`http://localhost:5000/user/${userData.email}`, {
          total: userData.total + income,
          email: userData.email
        }); 
      } catch (error) {
        console.error("Error saving income data: ", error);
      }

      // Save Check In/Out action to history table
      try {
        await axios.post("http://localhost:5000/history", {
          action,
          email: userData.email, // Use the logged-in user's email
          time: currentTime,
        });
      } catch (error) {
        console.error("Error saving check-in/out history: ", error);
      }

      setIsCheckedIn(false);
      setTimestamp(currentTime);
      localStorage.setItem("isCheckedIn", "false");
      localStorage.setItem("timestamp", currentTime); // Save check-out timestamp
    } else {
      // Check In
      setTimestamp(currentTime);
      setIsCheckedIn(true);
      localStorage.setItem("isCheckedIn", "true");
      localStorage.setItem("timestamp", currentTime);
    }

    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="container mx-auto p-8 flex items-center justify-center">
        <div className="bg-gray-200 p-8 rounded-lg w-full max-w-2xl text-center">
          <div className="w-40 h-40 bg-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
            {/* Placeholder for image */}
            <svg
              className="w-16 h-16 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="/assets/jay.jpg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 10a4 4 0 100 8 4 4 0 000-8z"
              ></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">
            {userData
              ? `${userData.firstName} ${userData.lastName}`
              : "Loading..."}
          </h2>
          <p className="text-gray-600 mb-6">
            {timestamp
              ? new Date(timestamp).toLocaleString()
              : "No Check In/Out"}
          </p>

          <button
            onClick={handleCheckInOut}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            {isCheckedIn ? "Check Out" : "Check In"}
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
            <h2 className="text-2xl font-bold mb-4">
              {isCheckedIn
                ? "You have checked in at"
                : "You have checked out at"}
            </h2>
            <p className="text-gray-600">
              {new Date(timestamp).toLocaleString()}
            </p>
          </div>
        </div>
      )}
      <div className="flex items-center justify-center mx-auto">
        <Footer />
      </div>
    </div>
  );
}
