import {Component} from '@angular/core';
import {AbstractControlOptions, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthRestService} from "../../services/user-service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {PasswordMatch} from "../../services/password-validator";
import {User} from "../../models/user";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  toggle: boolean = true;
  error: boolean = false;
  message: string = "";
  private subscription: Subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  constructor(
    private fb: FormBuilder,
    private authRestService: AuthRestService,
    private auth: AuthService,
    private router: Router,
  ) {
  }

  public form!: FormGroup;

  ngOnInit(): void {
    const options: AbstractControlOptions = {
      validators: PasswordMatch.matchingPasswords
    }

    this.form = this.fb.group({
        login: ['', [Validators.email, Validators.required]],
        password: ['', [Validators.required, Validators.maxLength(128), Validators.minLength(8)]],
      }, options
    )
  }

  public onLoginClick(): void {
    if (this.form.valid) {
      this.authRestService.login(this.form.value).subscribe({
        error: (): void => {
          this.messageError("User not found or password incorrect!")
        },
        next: (user: User): void => {
          this.auth.setUser(user);
          this.router.navigate(["/user/plans"]);
        },
      });
    } else {
      this.form.markAllAsTouched();
      this.messageError("Please check all fields!");
    }
  }

  private resetMessage(): void {
    this.error = false;
  }

  private messageError(message: string): void {
    this.message = message;
    this.error = true;
  }
}
