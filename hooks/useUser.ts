import { loginUser, signUpUser } from "@/services/userService";
import type { AppDispatch, RootState } from "@/store/store";
import type { NewUserInput, LoginUserInput } from "@/types/userTypes";
import { useDispatch, useSelector } from "react-redux";

export const useUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.user.data);
  const status = useSelector((state: RootState) => state.user.status);

  const loginUserAction = (data: LoginUserInput) => dispatch(loginUser(data));
  const signUpUserAction = (data: NewUserInput) => dispatch(signUpUser(data));

  return { user, status, loginUserAction, signUpUserAction };
};
