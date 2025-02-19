export interface CreateShareRoomRequest {
	userId: string;
	sharedRoomTitle: string;
}

export interface ShareRoomJoinRequest {
	userId: string;
	sharedRoomId: string;
}
