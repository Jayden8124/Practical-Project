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
  const [errorMessage, setErrorMessage] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [birth, setBirth] = useState("");
  const [rate, setRate] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get("http://localhost:5000/user");
      const user = response.data.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password
      );
      if (user) {
        localStorage.setItem("userEmail", user.email);
        localStorage.setItem("userPassword", user.password);
        localStorage.setItem("authToken", user.email);
        router.push("./home");
      } else {
        setErrorMessage("Invalid email or password");
      }
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !phone || !birth || !rate || !email || !password) {
      setErrorMessage("Please fill in all the fields");
      return;
    }
    try {
      const response = await axios.get("http://localhost:5000/user");
      const existingUser = response.data.find((u) => u.email === email);

      if (existingUser) {
        setErrorMessage("Email is already in use");
        return;
      }

      const newUser = {
        firstName,
        lastName,
        phone,
        birth,
        startDate: new Date().toISOString().split("T")[0],
        password,
        email,
        rate,
        total: 0,
      };

      await axios.post("http://localhost:5000/user", newUser);
      setMode(0);
    } catch (error) {
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return mode == 1 ? (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-0 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <form className="mt-6" onSubmit={handleSignUp}>
          <div className="mb-4">
            <label
              htmlFor="firstName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              First name
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md">
              <FaUserAlt className="text-gray-400" />
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
                className="w-full px-2 py-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="lastName"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Last name
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md">
              <FaUserAlt className="text-gray-400" />
              <input
                type="text"
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
                className="w-full px-2 py-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="phone"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Phone
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md">
              <FaPhone className="text-gray-400" />
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone"
                className="w-full px-2 py-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Date Field */}
          <div className="mb-4">
            <label
              htmlFor="date"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Date of Birth
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md">
              <FaCalendarAlt className="text-gray-400" />
              <input
                type="date"
                id="date"
                value={birth}
                onChange={(e) => setBirth(e.target.value)}
                className="w-full px-2 py-2 focus:outline-none"
              />
            </div>
          </div>

          {/* Rate Field */}
          <div className="mb-4">
            <label
              htmlFor="rate"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Rate
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md">
              <FaDollarSign className="text-gray-400" />
              <input
                type="number"
                id="rate"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                placeholder="Enter your rate"
                className="w-full px-2 py-2 focus:outline-none"
              />
            </div>
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md">
              <FaEnvelope className="text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-2 py-2 focus:outline-none"
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
            <div className="flex items-center px-3 border border-gray-300 rounded-md">
              <FaLock className="text-gray-400" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-2 py-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="confirmPassword"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Confirm Password
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md">
              <FaLock className="text-gray-400" />
              <input
                type="password"
                id="confirmPassword"
                placeholder="Enter your confirm password"
                className="w-full px-2 py-2 focus:outline-none"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none"
          >
            Create Account
          </button>
        </form>
        <p className="mt-4 py-5 text-sm text-center">
          Already have an account?{" "}
          <span
            onClick={(e) => setMode(0)}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Sign In
          </span>
        </p>
      </div>
    </div>
  ) : (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign In</h2>
        <form className="mt-6" onSubmit={handleSignIn}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md">
              <FaEnvelope className="text-gray-400" />
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-2 py-2 focus:outline-none"
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
            <div className="flex items-center px-3 border border-gray-300 rounded-md">
              <FaLock className="text-gray-400" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-2 py-2 focus:outline-none"
              />
            </div>
          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm mb-4">{errorMessage}</p>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 py-0.5 text-sm text-center">
          Don’t have an account?{" "}
          <span
            onClick={(e) => setMode(1)}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}
