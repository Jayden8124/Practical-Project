"use client";

import React, { useState } from 'react';
import Navbar from './Components/Navbar';

export default function Home() {
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [timestamp, setTimestamp] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleCheckInOut = () => {
    const currentTime = new Date().toLocaleString();
    setTimestamp(currentTime);
    setIsCheckedIn(!isCheckedIn);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto p-8 flex items-center justify-center">
        <div className="bg-gray-200 p-8 m-10 rounded-lg w-full max-w-2xl text-center">
          <div className="w-40 h-40 bg-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
            {/* Placeholder for image */}
            <svg className="w-16 h-16 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7a4 4 0 014-4h10a4 4 0 014 4v10a4 4 0 01-4 4H7a4 4 0 01-4-4V7z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10a4 4 0 100 8 4 4 0 000-8z"></path>
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Mr. Pakkhapol Saekow</h2>
          <p className="text-gray-600 mb-6">{timestamp ? timestamp : 'No Check In/Out'}</p>
          <button 
            onClick={handleCheckInOut}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            {isCheckedIn ? 'Check Out' : 'Check In'}
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
              {isCheckedIn ? 'You have checked out' : 'You have checked in'}
            </h2>
            <p className="text-gray-600">{timestamp}</p>
          </div>
        </div>
      )}
    </div>
  );
}
