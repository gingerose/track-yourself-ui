import {Component} from '@angular/core';
import {Collection} from "../../models/collections";
import {FindCollectionRequest} from "../../models/find-collection-request";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";
import {TeamService} from "../../services/team-service";
import {Team, TeamMember} from "../../models/team";
import {AddTeamRequest, UserData} from "../../models/add-team-request";
import {User} from "../../models/user";
import {cld} from "../../app.links";

@Component({
  selector: 'app-collections',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.css']
})
export class TeamsComponent {
  teams: Team[] = [];
  users: User[] = []
  listOfSelectedUsers: number[] = [];

  selectedUser: User = {
    userId: -1,
    login: '',
    password: '',
    picture: '',
    username: '',
    token: ''
  }
  userOptions: { label: string; value: number }[] = [];
  isLoading = false;
  userId: number
  findCollectionsRequest: FindCollectionRequest = {
    userId: -1,
    title: "",
    // @ts-ignore
    firstDate: null,
    // @ts-ignore
    secondDate: null
  }

  newCollection: Collection = {
    userId: +this.authService.getUserId(),
    collectionId: -1,
    title: "New Collection",
    fullAmount: 0,
    doneAmount: 0,
  }

  filmCollection: Collection = {
    userId: +this.authService.getUserId(),
    collectionId: 2435466,
    title: "Movies",
    fullAmount: 0,
    doneAmount: 0,
  }

  showDeletePopup?: boolean;
  collectionToDelete: Collection = {
    userId: +this.authService.getUserId(),
    collectionId: -1,
    title: "",
    fullAmount: 0,
    doneAmount: 0
  };

  teamToDelete: Team = {
    teamId: -1,
    teamTitle: '',
    members: []
  }

  addTeamRequest: AddTeamRequest = {
    teamTitle: "",
    members: []
  }

  addMembers: UserData[] = []

  private subscription: Subscription = new Subscription();
  showPopup: boolean = false;
  picture: string = ''

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  constructor(private authService: AuthService, private teamService: TeamService, private router: Router) {
    authService.loadUserData()
    this.findCollectionsRequest.userId = +authService.getUserId()
    this.userId = +authService.getUserId()
    this.picture = authService.getImageId()
    this.getTeams()
    this.loadInitialData()
  }

  public getTeams(): void {
    this.teamService.getTeamsByUserId(this.userId).subscribe({
      next: (teams: Team[]): void => {
        this.teams = teams
      }
    });
    this.showPopup = false;
  }

  // submitSearch(): void {
  //   this.getTeams()
  // }


  toCollection(item: Collection) {
    this.router.navigate([`/user/collections/${item.collectionId}/item`]);
  }

  toTeam(item: Team) {
    this.router.navigate([`/user/teams/${item.teamId}/tasks`]);
  }

  deleteTeamApi(item: Team) {
    this.teamService.deleteTeam(item.teamId).subscribe({
      next: (): void => {
      }
    });
  }

  confirmDelete(team: Team) {
    this.teamToDelete = team;
    this.showDeletePopup = true;
  }

  deleteTeam() {
    const index = this.teams.indexOf(this.teamToDelete);
    if (index !== -1) {
      this.teams.splice(index, 1);
      this.deleteTeamApi(this.teamToDelete)
    }

    this.showDeletePopup = false;
  }

  cancelDelete() {
    this.showDeletePopup = false;
  }

  openPopup() {
    this.showPopup = true;
  }

  cancel() {
    this.showPopup = false;
  }

  loadInitialData() {
    this.getUsers();
  }

  getUsers() {
    this.teamService.getUsers().subscribe({
      next: (users: User[]) => {
        this.users = users.filter(user => user.userId !== this.userId);
        this.userOptions = users.map(user => ({
          label: user.login,
          value: user.userId
        }));
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }


  onSearch(value: string) {
    if (value) {
      const filteredUsers = this.users.filter(user =>
        user.login.toLowerCase().includes(value.toLowerCase())
      );
      this.userOptions = filteredUsers.map(user => ({
        label: user.login,
        value: user.userId
      }));
    } else {
      this.userOptions = this.users.map(user => ({
        label: user.login,
        value: user.userId
      }));
    }
  }

  onSelectUsers(selectedUserIds: number[]) {
    this.addMembers = selectedUserIds.map(userId => {
      const user = this.users.find(u => u.userId === userId);
      return {
        userId: user!.userId,
        isLead: false,
        picture: user!.picture
      };
    });
  }

  addTeam(): void {
    this.addTeamApi(this.addTeamRequest)
  }

  public addTeamApi(team: AddTeamRequest): void {
    this.addTeamRequest.members = this.addMembers
    this.addTeamRequest.members.push({userId: this.userId, isLead: true, picture: this.picture})
    this.teamService.addTeam(team).subscribe({
      next: (newTeam: Team): void => {
        // @ts-ignore
        newTeam.members = this.addTeamRequest.members.map(member => ({
          memberId: null,
          userId: member.userId,
          username: this.users.find(user => user.userId === member.userId)?.username || '',
          picture: member.picture,
          isLead: member.isLead,
          comment: '',
          tasks: []
        }));
        this.teams.push(newTeam)
      }
    });
    this.showPopup = false;
  }


  getTopMembers(members: TeamMember[]): TeamMember[] {
    return members.slice(0, 4);
  }

  getCloudinaryImage(publicId: string): string {
    return cld.image(publicId).toURL();
  }

}
