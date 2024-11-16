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
  comment: string;
  tasks: TeamTask[]

}

export interface TeamTask {
  memberId: number;
  taskId: number;
  title: string;
  date: Date;
  status: string;
}
