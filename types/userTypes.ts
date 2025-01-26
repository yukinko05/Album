export interface User {
  email: string;
  uid: string;
  userName: string;
  iconImg: string | null;
  createdAt: string;
}

export interface LoginUser {
  email: string;
  uid: string;

}
export interface NewUserInput {
  email: string;
  password: string;
  userName: string;
  iconImg: string | null;
}

export interface LoginUserInput {
  email: string;
  password: string;
}
