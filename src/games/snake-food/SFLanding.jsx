"use client";
import React from 'react'
import sfLogo from '@/assets/images/sf-logo.png'
import './sflanding.css';

export const SFLanding = () => {
  return (
    <div
      className="fixed inset-0 flex items-center bg-cover bg-center"
      style={{
        backgroundImage: `url(${sfLogo.src})`,
      }}
    >
      <button
        className="ml-75 mt-50 px-12 py-5 rounded-full text-2xl font-extrabold text-white bg-gradient-to-b from-lime-400 to-green-600 shadow-lg border-4 border-green-700 transition-all duration-200 animate-pulseGlow active:from-green-700 active:to-green-900 active:scale-95 outline-none">
        PLAY NOW
      </button>
     
      <p className='text-white text-2xl font-extrabold absolute bottom-10 left-1/2 -translate-x-1/2 font-sans animate-pulse'>PRESS TAB AND SPACE TO START</p>
    </div>
  )
}
