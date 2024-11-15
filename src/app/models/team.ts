export interface Team {
  teamId: number;
  teamTitle: string;
  members: TeamMember[]
}
export interface TeamMember {
  memberId: number;
  userId: number;
  username: string;
  picture: string;
  isLead: boolean;
}
