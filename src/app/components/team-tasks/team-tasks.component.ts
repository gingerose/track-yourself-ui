import {Component} from "@angular/core";
import {AuthService} from "../../services/auth.service";
import {TeamService} from "../../services/team-service";
import {ActivatedRoute} from "@angular/router";
import {Team, TeamMember, TeamTask} from "../../models/team";
import {cld} from "../../app.links";
import {Task} from "@angular/compiler-cli/ngcc/src/execution/tasks/api";
import {CollectionItem} from "../../models/collection-item";

@Component({
  selector: 'app-collections',
  templateUrl: './team-tasks.component.html',
  styleUrls: ['./team-tasks.component.css']
})
export class TeamTasksComponent {
  team: Team = {
    teamId: -1,
    teamTitle: '',
    members: []
  }
  newTitle: string = ""
  members: TeamMember[] = []
  showPopup: boolean = false

  memberOptions: { label: string; value: number }[] = [];
  filteredMemberOptions: { label: string; value: number }[] = [];
  selectedUser: number | null = null;
  newTaskTitle: string = '';
  showTaskPopup: boolean = false;
  isLoading: boolean = false;
  isTitleEdit = false;

  public editedItem: TeamTask = {
    memberId: -1,
    taskId: -1,
    title: '',
    date: new Date(),
    status: 'EMPTY'
  };

  constructor(private authService: AuthService, private teamService: TeamService, private route: ActivatedRoute) {
    this.route.paramMap.subscribe(params => {
      // @ts-ignore
      this.team.teamId = +params.get('teamId');
    });
    this.getTeamMembersWithTasks()
    this.getTeamData()
  }

  getTeamData() {
    this.teamService.getTeamById(this.team.teamId).subscribe({
      next: (team: Team): void => {
        this.team.teamTitle = team.teamTitle
      }
    });
  }

  toggleTitleEdit() {
    this.isTitleEdit = true;
    this.newTitle = this.team.teamTitle;
  }

  cancelTitleEdit() {
    this.isTitleEdit = false;
  }

  updateTitle() {
    this.team.teamTitle = this.newTitle;
    this.isTitleEdit = false;
    this.updateTeam()
  }

  updateTeam() {
    this.teamService.updateTeam(this.team).subscribe({
      next: (): void => {
      }
    });
  }

  openPopup() {
    this.showPopup = true;
  }

  getTeamMembersWithTasks() {
    this.teamService.getTeamTasks(this.team.teamId).subscribe({
      next: (members: TeamMember[]): void => {
        this.members = members
      }
    });
  }

  getCloudinaryImage(publicId: string): string {
    return cld.image(publicId).toURL();
  }

  toggleTaskStatus(task: TeamTask): void {
    task.status = task.status === 'DONE' ? 'EMPTY' : 'DONE';
    this.updateTask(task)
  }

  openTaskPopup(): void {
    this.showTaskPopup = true;
    this.populateMemberOptions();
  }

  closeTaskPopup(): void {
    this.showTaskPopup = false;
    this.clearTaskForm();
  }

  addTask(): void {
    const member = this.members.find((m) => m.memberId === this.selectedUser);
    console.log(member)
    if (this.selectedUser && this.newTaskTitle && member) {
      const newTask: TeamTask = {
        taskId: -1,
        title: this.newTaskTitle,
        status: 'EMPTY',
        date: new Date(),
        memberId: member.memberId
      };

      if (member) {
        member.tasks.push(newTask);
      }

      this.teamService.addTeamTask(newTask).subscribe({
        next: () => {
          this.getTeamMembersWithTasks();
        },
        error: (err) => console.error(err),
      });

      this.closeTaskPopup();
    }
  }

  populateMemberOptions(): void {
    // @ts-ignore
    this.memberOptions = this.members.map((member) => ({
      label: member.username,
      value: member.memberId,
    }));
  }

  clearTaskForm(): void {
    this.selectedUser = null;
    this.newTaskTitle = '';
  }

  onMemberSearch(searchText: string): void {
    if (searchText) {
      this.filteredMemberOptions = this.memberOptions.filter((option) =>
        option.label.toLowerCase().includes(searchText.toLowerCase())
      );
    } else {
      this.filteredMemberOptions = [...this.memberOptions];
    }
  }

  onSelectUser(userId: number): void {
    this.selectedUser = userId;
  }

  saveComment(member: TeamMember) {
    this.teamService.updateMember(member).subscribe({
      next: (): void => {
      }
    });
  }

  deleteTask(item: TeamTask) {
    this.teamService.deleteTeamTask(item).subscribe({
      next: (): void => {
        this.members.forEach((member) => {
          const taskIndex = member.tasks.findIndex(task => task.taskId === item.taskId);

          if (taskIndex !== -1) {
            member.tasks.splice(taskIndex, 1);
          }
        });
      },
      error: (err) => {
        console.error("Failed to delete task:", err);
      }
    });
  }

  isEditing(item: TeamTask): boolean {
    return item === this.editedItem;
  }

  startEditing(item: TeamTask): void {
    this.editedItem = item;
  }

  stopEditing(item: TeamTask): void {
    if (this.editedItem.title !== undefined && this.editedItem.title !== '') {
      item.title = this.editedItem.title;
    }
    this.updateTask(this.editedItem)
    this.editedItem = {
      memberId: -1,
      taskId: -1,
      title: '',
      date: new Date(),
      status: 'EMPTY'
    };
  }

  updateTask(task: TeamTask) {
    this.teamService.updateTeamTask(task).subscribe({
      next: (): void => {
      }
    });
  }

}
