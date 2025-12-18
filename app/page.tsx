'use client';

import { useState } from 'react';
import UserInfoModal from '@/components/UserInfoModal';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      {/* Decorative organic shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-20 right-10 w-64 h-64 bg-terracotta-200 organic-blob opacity-30 animate-float"
          style={{ animationDelay: '0s' }}
        />
        <div
          className="absolute bottom-32 left-20 w-96 h-96 bg-amber-200 organic-blob opacity-20 animate-float"
          style={{ animationDelay: '2s' }}
        />
        <div
          className="absolute top-40 left-10 w-48 h-48 bg-sage-200 organic-blob opacity-25 animate-float"
          style={{ animationDelay: '1s' }}
        />
        <div
          className="absolute bottom-20 right-32 w-72 h-72 bg-sky-200 organic-blob opacity-20 animate-float"
          style={{ animationDelay: '3s' }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        {/* Hero badge */}
        <div className="inline-block mb-8 animate-fade-in">
          <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-terracotta-100">
            <span className="w-2 h-2 bg-terracotta-500 rounded-full animate-pulse"></span>
            <span className="text-sm font-medium text-terracotta-700">Simplifying Land Ownership</span>
          </span>
        </div>

        {/* Main heading */}
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-8 leading-tight animate-slide-up">
          <span className="block text-gray-900">Find Your</span>
          <span className="block text-gradient mt-2">Perfect Plot</span>
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-700 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up animation-delay-200">
          We connect you with government land tenders, making it simple to find and buy
          your first piece of land. No more confusion, just clear paths to your dream home.
        </p>

        {/* CTA Button */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up animation-delay-400">
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary text-lg group relative overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Your Journey
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-terracotta-600 to-amber-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>

          <button className="btn-secondary text-lg">
            Learn How It Works
          </button>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 pt-12 border-t border-gray-200/50 animate-fade-in animation-delay-600">
          <p className="text-sm text-gray-500 mb-6">Trusted by hundreds of first-time land buyers</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-terracotta-600 mb-1">500+</div>
              <div className="text-sm text-gray-600">Active Tenders</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-amber-600 mb-1">50+</div>
              <div className="text-sm text-gray-600">Locations</div>
            </div>
            <div className="w-px h-12 bg-gray-200"></div>
            <div className="text-center">
              <div className="text-3xl font-bold text-sage-600 mb-1">1000+</div>
              <div className="text-sm text-gray-600">Available Lots</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features grid */}
      <div className="absolute bottom-0 left-0 right-0 pb-8 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-container p-6 animate-scale-in animation-delay-400">
            <div className="w-12 h-12 bg-gradient-warm rounded-xl mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Verified Tenders</h3>
            <p className="text-sm text-gray-600">Official government data, updated regularly</p>
          </div>

          <div className="card-container p-6 animate-scale-in animation-delay-600">
            <div className="w-12 h-12 bg-gradient-earth rounded-xl mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Personalized Pricing</h3>
            <p className="text-sm text-gray-600">Accurate costs based on your profile</p>
          </div>

          <div className="card-container p-6 animate-scale-in animation-delay-800">
            <div className="w-12 h-12 bg-gradient-warm rounded-xl mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-sm text-gray-600">Find your perfect lot in minutes</p>
          </div>
        </div>
      </div>

      {/* User Info Modal */}
      <UserInfoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </main>
  );
}
