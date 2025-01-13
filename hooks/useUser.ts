import { useDispatch, useSelector } from "react-redux";
import { signUpUser, loginUser } from "@/services/userService";
import { RootState, AppDispatch } from "@/store/store";
import { UserInput } from "@/types/type";

export const useUser = () => {
	const dispatch = useDispatch<AppDispatch>();
	const user = useSelector((state: RootState) => state.user.data);
	const status = useSelector((state: RootState) => state.user.status);

	const getUser = (data: UserInput) => dispatch(loginUser(data));
	const addUser = (data: UserInput) => dispatch(signUpUser(data));

	return { user, status, getUser, addUser };
};
