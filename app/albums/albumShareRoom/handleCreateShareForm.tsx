"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/react";
import { type SubmitHandler, useForm } from "react-hook-form";
import * as zod from "zod";
import type { CreateShareRoomRequest } from "@/types/shareTypes";

const schema = zod.object({
	sharedRoomTitle: zod
		.string()
		.min(1, { message: "タイトルを入力してください" }),
});

export type FormFields = zod.infer<typeof schema>;

export default function CreateShareRoomForm() {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormFields>({
		resolver: zodResolver(schema),
	});

	const handleCreateShareRoom: SubmitHandler<FormFields> = (data) => {
		console.log(data.sharedRoomTitle);
	};

	return (
		<div>
			<form onSubmit={handleSubmit((data) => handleCreateShareRoom(data))}>
				<h1>シェアルーム作成</h1>
				<div>
					<label htmlFor="sharedRoomTitle">シェアルーム名</label>
					<input {...register("sharedRoomTitle")} type="text" />
					{errors.sharedRoomTitle && (
						<span>{errors.sharedRoomTitle.message}</span>
					)}
				</div>
				<Button type="submit" color="primary">
					作成する
				</Button>
			</form>
		</div>
	);
}
