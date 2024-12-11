import ResetPasswordClient from "../reset-password-client";

interface ResetPasswordPageProps {
  params: Promise<{
    token: string;
  }>;
}

export default async function ResetPasswordPage({ params }: ResetPasswordPageProps) {
  const { token } = await params;
  return <ResetPasswordClient params={{ token }} />;
}
