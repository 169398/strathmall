'use client'
export default function VerificationPage() {

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">Check Your Email</h1>
      <p className="mt-4 text-lg">
        A verification link has been sent to <strong>{}</strong>.
      </p>
      <p className="mt-2 text-lg">
        Please check your inbox and click the link to verify your email address.
      </p>
    </div>
  );
}
