export const validEmail = new RegExp("^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$");
export const validPassword = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,}$"
);

export const passwordRequirementsMessage =
  "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
