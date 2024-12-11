import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PasswordInputProps {
  id: string;
  name: string;
  value?: string;
  defaultValue?: string;
  // eslint-disable-next-line no-unused-vars
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  placeholder?: string;
  showStrengthIndicator?: boolean;
}

export function PasswordInput({
  id,
  name,
  value,
  defaultValue,
  onChange,
  required,
  placeholder = "Enter password",
  showStrengthIndicator = false,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState({
    score: 0,
    hasLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const checkPasswordStrength = (password: string) => {
    const newStrength = {
      score: 0,
      hasLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    newStrength.score = Object.values(newStrength).filter(Boolean).length - 1;
    setStrength(newStrength);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (showStrengthIndicator) {
      checkPasswordStrength(e.target.value);
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          required={required}
          placeholder={placeholder}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
          onClick={() => setShowPassword(!showPassword)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeOff className="h-4 w-4 text-gray-500" />
          ) : (
            <Eye className="h-4 w-4 text-gray-500" />
          )}
        </Button>
      </div>

      {showStrengthIndicator && (
        <div className="space-y-2 text-sm">
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`h-2 w-full rounded ${
                  i <= strength.score
                    ? [
                        "bg-red-500",
                        "bg-orange-500",
                        "bg-yellow-500",
                        "bg-lime-500",
                        "bg-green-500",
                      ][strength.score]
                    : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <ul className="space-y-1 text-gray-500">
            <li className={strength.hasLength ? "text-green-500" : ""}>
              ✓ At least 8 characters
            </li>
            <li className={strength.hasUppercase ? "text-green-500" : ""}>
              ✓ At least one uppercase letter
            </li>
            <li className={strength.hasLowercase ? "text-green-500" : ""}>
              ✓ At least one lowercase letter
            </li>
            <li className={strength.hasNumber ? "text-green-500" : ""}>
              ✓ At least one number
            </li>
            <li className={strength.hasSpecialChar ? "text-green-500" : ""}>
              ✓ At least one special character
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
