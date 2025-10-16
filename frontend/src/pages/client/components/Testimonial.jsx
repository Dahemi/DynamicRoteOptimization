import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

const WasteManagementStats = () => {
  return (
    <div className="px-44 mx-auto p-8 space-y-16 py-20">
      {/* Header and Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Title */}
        <div className="md:col-span-1">
          <h2 className="text-4xl font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            Driving sustainability through technology and innovation.
          </h2>
        </div>

        {/* Statistics */}
        <div className="md:col-span-2 grid grid-cols-2 gap-8">
          {/* Stat 1 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-5xl font-bold text-gray-900">92%</span>
              <svg
                className="w-6 h-6 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              User satisfaction rate
            </h3>
            <p className="text-gray-500">
              Residents and businesses highly rate our platform for ease of use and reliability.
            </p>
          </div>

          {/* Stat 2 */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-5xl font-bold text-gray-900">95%</span>
              <svg
                className="w-6 h-6 text-emerald-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 10l7-7m0 0l7 7m-7-7v18"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              On-time collection rate
            </h3>
            <p className="text-gray-500">
              Scheduled pickups completed on time with real-time tracking and notifications.
            </p>
          </div>
        </div>
      </div>

      {/* Testimonial Section */}
      <div className="bg-white rounded-[100px] shadow-lg p-8">
        <div className="flex items-center space-x-6">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-24 h-24 rounded-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1592827095305-68f21edefb82?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="Testimonial"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute text-white -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center">
              <span className="text-[45px]">"</span>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div className="space-y-1 flex">
                <p className="text-gray-600 text-lg mb-4 w-[70%]">
                  ZeroBin has completely revolutionized how we manage waste collection in our municipality. The real-time tracking and transparent pricing have increased accountability and made our operations significantly more efficient.
                </p>
                <div className="border-l border-gray-200 m-4"></div>
                <div className="flex flex-col justify-items-center justify-center">
                  <h3 className="font-semibold text-gray-900">Michael Rodriguez</h3>
                  <p className="text-gray-500">Municipal Operations Director</p>
                </div>
              </div>

              {/* Navigation Buttons */}
              {/* <div className="flex space-x-2">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <ArrowRight className="w-6 h-6 text-gray-600" />
                </button>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WasteManagementStats;
