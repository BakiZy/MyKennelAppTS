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
