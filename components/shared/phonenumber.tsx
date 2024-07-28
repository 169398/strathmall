
'use client';

import React, { useState } from "react";
import { parsePhoneNumberFromString, AsYouType, CountryCode } from "libphonenumber-js";

function PhoneNumberInput() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [country, setCountry] = useState<CountryCode | undefined>("KE"); // Kenya is the default

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setCountry(event.target.value as CountryCode);
    setPhoneNumber(""); // Clear input when country changes
  };

  const handlePhoneNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const input = event.target.value;
    const formatter = new AsYouType({ defaultCountry: country }); // Format as the user types
    const formatted = formatter.input(input);
    setPhoneNumber(formatted);

    // Optional: Validate after formatting
    const parsed = parsePhoneNumberFromString(formatted, country as any);
    if (parsed && !parsed.isValid()) {
      // Handle invalid input (e.g., show error message)
    }
  };

  return (
    <div>
      <select value={country} onChange={handleCountryChange}>
        <option value="KE">Kenya (+254)</option>
        {/* Add other country options */}
      </select>
      <input
        type="tel"
        value={phoneNumber}
        onChange={handlePhoneNumberChange}
        placeholder="Enter phone number"
      />
    </div>
  );
}

export default PhoneNumberInput;
