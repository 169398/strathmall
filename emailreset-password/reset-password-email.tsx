import React from "react";
import { user } from "@/types/sellerindex";

interface ResetPasswordEmailProps {
  resetLink: string;
  user: user;
}

const ResetPasswordEmail: React.FC<ResetPasswordEmailProps> = ({
  resetLink,
  user,
}) => {
  return (
    <div
      style={{
        backgroundColor: "#f0f4f8",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          backgroundColor: "#ffffff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          style={{
            color: "#0044cc",
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          Reset Your Password, {user.name}
        </h1>
        <p style={{ fontSize: "16px", color: "#333333", marginBottom: "20px" }}>
          You requested to reset your password. Please click the button below to
          proceed:
        </p>
        <a
          href={resetLink}
          style={{
            display: "inline-block",
            backgroundColor: "#0044cc",
            color: "#ffffff",
            padding: "10px 20px",
            borderRadius: "5px",
            textDecoration: "none",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          Reset Password
        </a>
        <p style={{ fontSize: "14px", color: "#666666", marginTop: "20px" }}>
          If you did not request this change, you can safely ignore this email.
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordEmail;
