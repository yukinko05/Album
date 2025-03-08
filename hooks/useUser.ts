import type { NewUserInput, LoginUserInput } from "@/types/userTypes";
import { useUserStore } from "@/stores/userStore";

export const useUser = () => {
	const user = useUserStore((state) => state.user);
	const status = useUserStore((state) => state.status);
	const login = useUserStore((state) => state.login);
	const signUp = useUserStore((state) => state.signUp);

	const loginUserAction = (data: LoginUserInput) => login(data);
	const signUpUserAction = (data: NewUserInput) => signUp(data);

	return { user, status, loginUserAction, signUpUserAction };
};
