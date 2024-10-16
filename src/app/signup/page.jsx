import React from 'react';
import Link from 'next/link';
import { FaEnvelope, FaLock, FaUserAlt, FaPhone } from 'react-icons/fa';

const SignUp = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-0 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">Sign Up</h2>
        <form className="mt-6">
          <div className="mb-4">
            <label htmlFor="firstName" className="block mb-2 text-sm font-medium text-gray-700">
              First name
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md">
              <FaUserAlt className="text-gray-400" />
              <input
                type="text"
                id="firstName"
                placeholder="Enter your first name"
                className="w-full px-2 py-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="lastName" className="block mb-2 text-sm font-medium text-gray-700">
              Last name
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md">
              <FaUserAlt className="text-gray-400" />
              <input
                type="text"
                id="lastName"
                placeholder="Enter your last name"
                className="w-full px-2 py-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md">
              <FaEnvelope className="text-gray-400" />
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                className="w-full px-2 py-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block mb-2 text-sm font-medium text-gray-700">
              Phone
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md">
              <FaPhone className="text-gray-400" />
              <input
                type="tel"
                id="phone"
                placeholder="Enter your phone"
                className="w-full px-2 py-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="flex items-center px-3 border border-gray-300 rounded-md">
              <FaLock className="text-gray-400" />
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                className="w-full px-2 py-2 focus:outline-none"
              />
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">
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

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800 focus:outline-none"
          >
            Create Account
          </button>
        </form>
        <p className="mt-4 py-5 text-sm text-center">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;