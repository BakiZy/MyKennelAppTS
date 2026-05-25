export const validEmail = new RegExp("^[a-zA-Z0-9]+@[a-zA-Z0-9.-]+.[a-zA-Z]$");
export const validPassword = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,}$"
);

export const passwordRequirementsMessage =
  "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.";
