import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { FormBuilder, Validators } from '@angular/forms';
import { mustMatch } from '../helpers/must-match.validator';

@Component({
  selector: 'app-user-signup',
  templateUrl: './user-signup.component.html',
  styleUrls: ['./user-signup.component.css']
})
export class UserSignupComponent implements OnInit {
  signupForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, { validators: mustMatch('password', 'confirmPassword') });
  isSignupSuccess = false;

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
  }

  get f() { return this.signupForm.controls; }

  onSubmit() {
    if (this.signupForm.invalid) {
      return;
    }

    this.userService.register(this.f.email.value, this.f.password.value)
        .subscribe(
          user => {
            this.isSignupSuccess = true;
            this.signupForm.reset();
          },
          error => {
            this.isSignupSuccess = false;
            this.signupForm.setErrors({signupFaled: true});
          }
        );
  }

}
