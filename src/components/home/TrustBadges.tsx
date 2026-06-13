"use client"

import React from 'react'

const BADGES = [
  {
    title: 'Comprehensive\nInsurance cover',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
         <path d="M22 36a4 4 0 100-8 4 4 0 000 8zM42 36a4 4 0 100-8 4 4 0 000 8z" stroke="#2C4A57" strokeWidth="2"/>
         <path d="M12 28l4-8h32l4 8M12 28v12h40V28" stroke="#2C4A57" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
         <path d="M28 16h8v8h-8z" fill="#E8534A"/>
         <path d="M38 12l8 8-4-4-4 4v-8z" fill="#0D9B84"/>
      </svg>
    )
  },
  {
    title: 'We Accept\nDebit & Credit\nCards',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
         <rect x="12" y="24" width="40" height="24" rx="4" stroke="#2C4A57" strokeWidth="2"/>
         <rect x="8" y="20" width="40" height="24" rx="4" fill="#E8534A"/>
         <path d="M8 28h40" stroke="#2C4A57" strokeWidth="2"/>
      </svg>
    )
  },
  {
    title: 'Inside Airport\nTerminal',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="32" cy="16" r="6" stroke="#2C4A57" strokeWidth="2"/>
        <path d="M24 32v16h16V32" stroke="#2C4A57" strokeWidth="2"/>
        <rect x="16" y="26" width="32" height="6" fill="#0D9B84"/>
      </svg>
    )
  },
  {
    title: 'Zero\ncommission',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
         <circle cx="32" cy="32" r="16" stroke="#2C4A57" strokeWidth="2" strokeDasharray="4 4"/>
         <path d="M32 24v16M28 28h8M28 32h8" stroke="#0D9B84" strokeWidth="2"/>
         <circle cx="48" cy="16" r="8" fill="#E8534A"/>
      </svg>
    )
  },
  {
    title: 'No excess\npre-auth',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="24" width="32" height="20" rx="2" stroke="#2C4A57" strokeWidth="2"/>
        <path d="M32 16l8 8-8 8-8-8 8-8z" fill="#E8534A"/>
      </svg>
    )
  },
  {
    title: 'Simple & Fast\nCheckout',
    icon: (
      <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="16" width="24" height="32" rx="4" stroke="#2C4A57" strokeWidth="2"/>
        <circle cx="32" cy="40" r="2" fill="#0D9B84"/>
        <path d="M44 32l8-8-8-8" stroke="#E8534A" strokeWidth="2"/>
      </svg>
    )
  }
]

export default function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-6 sm:gap-12 mt-12 mb-8">
      {BADGES.map((badge, i) => (
        <div key={i} className="flex flex-col items-center max-w-[100px]">
          <div className="w-16 h-16 mb-3 flex-shrink-0 flex items-center justify-center">
            {badge.icon}
          </div>
          <p className="text-sm text-gray-600 text-center leading-snug whitespace-pre-line">
            {badge.title}
          </p>
        </div>
      ))}
    </div>
  )
}
