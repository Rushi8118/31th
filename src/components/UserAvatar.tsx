import React, { useState, useEffect } from 'react'

type UserAvatarProps = {
  imageUrl?: string | null
  fullName?: string | null
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function UserAvatar({
  imageUrl,
  fullName,
  size = 'md',
  className = '',
}: UserAvatarProps) {
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setImgError(false)
  }, [imageUrl])

  const getInitials = (name?: string | null) => {
    if (!name) return 'U'
    const parts = name.trim().split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  const initials = getInitials(fullName)

  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-lg font-bold',
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center rounded-full shrink-0 overflow-hidden select-none border border-[#C49A2B]/30 bg-[#1a1a2e] text-[#C49A2B] font-semibold ${sizeClasses[size]} ${className}`}
    >
      {imageUrl && !imgError ? (
        <img
          src={imageUrl}
          alt={fullName || 'User Profile'}
          className="h-full w-full object-cover"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="flex items-center justify-center font-serif">
          {initials}
        </span>
      )}
    </div>
  )
}
