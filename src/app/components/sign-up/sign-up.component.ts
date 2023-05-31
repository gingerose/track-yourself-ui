import {Component} from '@angular/core';
import {User} from "../../models/user";
import {AbstractControlOptions, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthRestService} from "../../services/user-service";
import {PasswordMatch} from "../../services/password-validator";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {HttpErrorResponse} from "@angular/common/http";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent {
  toggle: boolean = true;
  error: boolean = false;
  message: string = "";

  constructor(
    private fb: FormBuilder,
    private authRestService: AuthRestService,
    private auth: AuthService,
    private router: Router,
  ) {
  }

  public form!: FormGroup;
  private subscription: Subscription = new Subscription();

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    const options: AbstractControlOptions = {
      validators: PasswordMatch.matchingPasswords
    }

    this.form = this.fb.group({
        login: ['', [Validators.email, Validators.required]],
        username: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.maxLength(128), Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.maxLength(128), Validators.minLength(8)]],
      }, options
    )
  }

  public onSignUpClick(): void {
    this.resetMessage();
    if (this.form.valid) {
      this.authRestService.signUp(this.form.value).subscribe({
        error: (error: HttpErrorResponse): void => {
          this.messageError(error.error)
        },
        next: (): void => {
          this.toggle = false;
          this.router.navigate(["/login"]);
        },
      });
    } else {
      this.messageError("Fill in all the fields");
      this.form.markAllAsTouched();
    }
  }

  private messageError(message: string): void {
    this.message = message;
    this.error = true;
  }

  private resetMessage(): void {
    this.error = false;
  }

}
