"use client";

import React, { useState } from "react";
import {
  FaEnvelope,
  FaLock,
  FaUserAlt,
  FaPhone,
  FaCalendarAlt,
  FaDollarSign,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function Page() {
  const router = useRouter();
  const [mode, setMode] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [birth, setBirth] = useState("");
  const [rate, setRate] = useState("");

  const clearFormData = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setFirstName("");
    setLastName("");
    setPhone("");
    setBirth("");
    setRate("");
    setErrorMessage("");
  };

  const validateEmail = (email) => {
    const emailRegex = /^[\w-.]+@(gmail\.com|admin\.com)$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/user/login", { email, password });
      localStorage.setItem("userEmail", response.data.email);
      localStorage.setItem("authToken", response.data.email);
      router.push("./home");
    } catch (error) {
      setErrorMessage("Invalid email or password");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone || !birth || !rate || !email || !password) {
      setErrorMessage("Please fill in all the fields");
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage("Email must be in the format test@gmail.com or test@admin.com");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    if (!validatePhone(phone)) {
      setErrorMessage("Phone number must be 10 digits long");
      return;
    }

    const formattedPhone = phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");

    try {
      const newUser = {
        firstName,
        lastName,
        phone: formattedPhone,
        birth,
        email,
        password,
        rate,
        total: 0,
      };

      await axios.post("http://localhost:5000/user", newUser);
      clearFormData();
      setErrorMessage(""); // Clear the error message
      setMode(0);
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return mode === 1 ? (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-200 py-10">
      <div className="w-full max-w-md p-8 space-y-0 bg-white rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-slate-900 mb-6">Sign Up</h2>
        <form className="mt-6" onSubmit={handleSignUp}>
          {/* First Name */}
          <div className="mb-4">
            <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700">
              First name
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md shadow-sm">
              <FaUserAlt className="text-gray-400" />
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="w-full px-2 py-2 focus:outline-none focus:border-indigo-500 focus:ring-gray-700 rounded-md"
              />
            </div>
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">
              Last name
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md shadow-sm">
              <FaUserAlt className="text-gray-400" />
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="w-full px-2 py-2 focus:outline-none focus:border-indigo-500 focus:ring-gray-700 rounded-md"
              />
            </div>
          </div>

          {/* Phone */}
          <div className="mb-4">
            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
              Phone
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md shadow-sm">
              <FaPhone className="text-gray-400" />
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number (10 digits)"
                className="w-full px-2 py-2 focus:outline-none focus:border-indigo-500 focus:ring-gray-700 rounded-md"
              />
            </div>
          </div>

          {/* Date of Birth */}
          <div className="mb-4">
            <label htmlFor="date" className="block mb-2 text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md shadow-sm">
              <FaCalendarAlt className="text-gray-400" />
              <input
                type="date"
                id="date"
                value={birth}
                onChange={(e) => setBirth(e.target.value)}
                className="w-full px-2 py-2 focus:outline-none focus:border-indigo-500 focus:ring-gray-700 rounded-md"
              />
            </div>
          </div>

          {/* Rate */}
          <div className="mb-4">
            <label htmlFor="rate" className="block mb-2 text-sm font-medium text-gray-700">
              Rate
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md shadow-sm">
              <FaDollarSign className="text-gray-400" />
              <input
                type="number"
                id="rate"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="Enter your rate"
                className="w-full px-2 py-2 focus:outline-none focus:border-indigo-500 focus:ring-gray-700 rounded-md"
              />
            </div>
          </div>

          {/* Email */}
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md shadow-sm">
              <FaEnvelope className="text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email (e.g., test@gmail.com)"
                className="w-full px-2 py-2 focus:outline-none focus:border-indigo-500 focus:ring-gray-700 rounded-md"
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md shadow-sm">
              <FaLock className="text-gray-400" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-2 py-2 focus:outline-none focus:border-indigo-500 focus:ring-gray-700 rounded-md"
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md shadow-sm">
              <FaLock className="text-gray-400" />
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                className="w-full px-2 py-2 focus:outline-none focus:border-indigo-500 focus:ring-gray-700 rounded-md"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="mt-4 w-full px-4 py-2 text-white bg-black rounded-xl hover:bg-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2"
          >
            Create Account
          </button>
        </form>
        <p className="mt-4 py-5 text-sm text-center">
          Already have an account?{" "}
          <span
            onClick={() => setMode(0)}
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-white to-gray-200">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-3xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-slate-900">Sign In</h2>
        <form className="mt-6" onSubmit={handleSignIn}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md shadow-sm">
              <FaEnvelope className="text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-2 py-2 focus:outline-none focus:border-indigo-500 focus:ring-gray-700 rounded-md"
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md shadow-sm">
              <FaLock className="text-gray-400" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-2 py-2 focus:outline-none focus:border-indigo-500 focus:ring-gray-700 rounded-md"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="mt-4 w-full px-4 py-2 text-white bg-black rounded-xl hover:bg-gray-800 shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-700 focus:ring-offset-2"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 py-0.5 text-sm text-center">
          Don’t have an account?{" "}
          <span
            onClick={(e) => setMode(1)}
            className="text-indigo-600 hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}   
