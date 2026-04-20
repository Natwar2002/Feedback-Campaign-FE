import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, UserButton } from '@clerk/clerk-react'
import { ROUTES } from '@/routes/route-constants'

export const Home = () => {
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()

  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-4 border-b border-gray-100">
        <span className="text-lg font-semibold text-gray-900">FeedbackSaaS</span>
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              <button
                onClick={() => navigate(ROUTES.PROTECTED.ORGANIZATION)}
                className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Organization
              </button>
              {/* Clerk's built-in avatar + sign out dropdown */}
              <UserButton afterSignOutUrl={ROUTES.ROOT} />
            </>
          ) : (
            <>
              <button
                onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Log in
              </button>
              <button
                onClick={() => navigate(ROUTES.AUTH.REGISTER)}
                className="px-4 py-2 text-sm font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Sign up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        <span className="text-xs font-medium tracking-widest text-indigo-600 uppercase mb-4">
          Feedback made simple
        </span>
        <h1 className="text-5xl font-bold text-gray-900 leading-tight max-w-2xl mb-6">
          Collect feedback that actually matters
        </h1>
        <p className="text-lg text-gray-500 max-w-xl mb-10">
          Run targeted feedback campaigns, understand your users, and build better products — all in one place.
        </p>

        {isSignedIn ? (
          <button
            onClick={() => navigate(ROUTES.PROTECTED.ORGANIZATION)}
            className="px-8 py-3 text-base font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Go to Organization →
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(ROUTES.AUTH.REGISTER)}
              className="px-8 py-3 text-base font-medium bg-gray-900 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              Get started free →
            </button>
            <button
              onClick={() => navigate(ROUTES.AUTH.LOGIN)}
              className="px-8 py-3 text-base font-medium text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Log in
            </button>
          </div>
        )}

        <p className="text-sm text-gray-400 mt-4">No credit card required</p>
      </main>

    </div>
  )
}