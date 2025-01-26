export interface User {
  email: string;
  uid: string;
  userName: string;
  iconImg: string | null;
  createdAt: string;
}

export interface UserInput {
  email: string;
  password: string;
  userName: string;
  iconImg: string | null;
}
