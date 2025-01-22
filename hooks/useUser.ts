import { loginUser, signUpUser } from "@/services/userService";
import type { AppDispatch, RootState } from "@/store/store";
import type { UserInput } from "@/types/type";
import { useDispatch, useSelector } from "react-redux";

export const useUser = () => {
	const dispatch = useDispatch<AppDispatch>();
	const user = useSelector((state: RootState) => state.user.data);
	const status = useSelector((state: RootState) => state.user.status);

	const loginUserAction = (data: UserInput) => dispatch(loginUser(data));
	const signUpUserAction = (data: UserInput) => dispatch(signUpUser(data));

	return { user, status, loginUserAction, signUpUserAction };
};
