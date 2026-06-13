"use client"

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("PAGE CRASH:", error)
  }, [error])

  return (
    <div className="p-10">
      <h2>Something went wrong in booking!</h2>
      <p className="text-red-500">{error.message}</p>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
