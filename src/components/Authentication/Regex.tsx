export const validEmail = new RegExp("^[a-zA-Z0-9]+@[a-zA-Z0-9.-]+.[a-zA-Z]$");
export const validPassword = new RegExp(
  "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z\\d]).{8,}$"
);
