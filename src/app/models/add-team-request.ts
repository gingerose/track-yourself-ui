export interface AddTeamRequest {
  teamTitle: string
  members: UserData[]
}

export interface UserData {
  userId: number;
  isLead: boolean;
  picture: string
}
