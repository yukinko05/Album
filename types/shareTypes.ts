export interface Sharegroups {
  sharegroupId: string;
  sharedgroupTitle: string;
  createdAt: string;
  updatedAt: string;
  users: string[];
}

export interface CreateSharegroupRequest {
  userId: string;
  sharedgroupTitle: string;
}

export interface SharegroupJoinRequest {
  userId: string;
  sharedgroupId: string;
}
