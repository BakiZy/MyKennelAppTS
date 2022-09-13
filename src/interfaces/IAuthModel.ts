export interface ILoginResponse {
  token: string;
  expiration: string;
  email: string;
  role: string;
  username: string;
}

export interface IRoleModel {
  id: string;
  name: string;
}

export interface IUserModel {
  userName: string;
  id: string;
  email: string;
}

export interface IUserProps {
  admins: IUserModel[];
  users: IUserModel[];
  onRemove: (id: string) => void;
}

export interface IErrorProps {
  title: string;
  message: string;
  onConfirm: () => void;
}
