export interface ShareRooms {
	shareRoomId: string;
	sharedRoomTitle: string;
	createdAt: string;
	updatedAt: string;
	users: string[];
}

export interface CreateShareRoomRequest {
	userId: string;
	sharedRoomTitle: string;
}

export interface ShareRoomJoinRequest {
	userId: string;
	sharedRoomId: string;
}
