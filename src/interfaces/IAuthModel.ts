export interface ILoginResponse {
  token: string;
  username: string;
  expiration: string;
  email: string;
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
  users: IUserModel[];
  onRemove: (id: string) => void;
}
