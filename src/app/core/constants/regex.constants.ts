export const REGEX = {
  // Regex for validating email addresses
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  // Regex for validating phone numbers (10 digits)
  phone: /^\d{10}$/,
  // Regex for validating passwords (at least 6 characters, at least one letter and one number)
  password: /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{6,}$/,
};
