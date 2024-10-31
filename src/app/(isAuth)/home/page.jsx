"use client";

import React, { useState, useEffect } from "react";
import Footer from "../../Components/Footer";
import Image from "next/image";
import axios from "axios";
import { useRouter } from "next/navigation";

const Home = () => {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [timestamp, setTimestamp] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState("");
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
        setProfileImage(
          matchedUser.profileImage.startsWith("http")
            ? matchedUser.profileImage
            : `http://localhost:5000${matchedUser.profileImage}`
        );
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
      let rate = userData.rate || 60; // ใช้อัตราจากผู้ใช้หากมี

      // เพิ่มอัตราการคิดเงินเมื่อทำงานเกิน 8 ชั่วโมง
      if (minutesWorked > 480) {
        rate *= 1.5;
      }

      const income = Math.round((minutesWorked / 60) * rate);

      // บันทึกข้อมูล totalIncome ลงฐานข้อมูล
      try {
        await axios.put(`http://localhost:5000/user/${userData.email}`, {
          total: userData.total + income,
          email: userData.email,
        });
      } catch (error) {
        console.error("Error saving income data: ", error);
      }

      // บันทึกการ Check Out ลงในตาราง history พร้อมกับ income
      try {
        await axios.post("http://localhost:5000/history", {
          action,
          email: userData.email,
          time: currentTime,
          income: income,
        });
      } catch (error) {
        console.error("Error saving check-in/out history: ", error);
      }

      setIsCheckedIn(false);
      setTimestamp(currentTime);
      localStorage.setItem("isCheckedIn", "false");
      localStorage.setItem("timestamp", currentTime);
    } else {
      // Check In
      // บันทึกการ Check In ลงในตาราง history (ไม่มี income ตอน check in)
      try {
        await axios.post("http://localhost:5000/history", {
          action,
          email: userData.email,
          time: currentTime,
          income: 0, // ใส่เป็น 0 เพราะยังไม่ได้คำนวณรายได้ตอน Check In
        });
      } catch (error) {
        console.error("Error saving check-in history: ", error);
      }

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
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-200 flex flex-col pt-24">
      <div className="container mx-auto p-8 flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-2xl text-center">
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
          <h2 className="text-2xl font-semibold mb-4">
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
            className="text-lg bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:bg-indigo-700 hover:shadow-lg transition-all duration-300 ease-in-out"
          >
            {isCheckedIn ? "Check Out" : "Check In"}
          </button>
        </div>
      </div>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-sm w-full text-center relative shadow-lg">
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
      <Footer />
    </div>
  );
};

export default Home;
