import Link from "next/link";

export const metadata = {
  title: "Sign In | GoSupportMe",
};

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-bg-faint px-4 py-12">
      <div className="max-w-md mx-auto rounded-xl border border-border-light bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-text-primary">Sign in</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Welcome back. Sign in to manage your fundraisers, donations, and notifications.
        </p>

        <form className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-text-primary mb-1.5">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-md border border-border-light px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-1.5">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              className="w-full rounded-md border border-border-light px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
          </div>

          <button
            type="button"
            className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors"
          >
            Sign in
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-text-secondary">
          New to GoSupportMe?{" "}
          <Link href="/charity/new" className="text-primary font-medium hover:underline">
            Start a fundraiser
          </Link>
        </p>
      </div>
    </div>
  );
}
