import { FormControl, ReactiveFormsModule, Validators, NonNullableFormBuilder } from '@angular/forms';
import { Component, inject, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { HttpErrorResponse } from '@angular/common/http';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { SpinnerComponent } from '../../../shared/spinner/spinner.component';
import { BackendService } from '../../../core/services/backend.service';
import { ErrorService } from '../../../core/services/error.service';
import { SignIn } from '../../../core/interfaces/signIn';
import { BehaviorSubject } from 'rxjs';
import { NotificationService } from '../../../core/services/notification.service';
import { Login } from '../../../core/interfaces/python-interfaces';
import { PythonService } from '../../../core/services/python.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, SpinnerComponent, ReactiveFormsModule, MatCardModule, MatInputModule, MatIconModule, MatButtonModule, MatFormFieldModule, CommonModule],
  templateUrl: './login.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent implements OnInit {

  //Atributos

  private _formBuilder = inject(NonNullableFormBuilder);
  private _notifications = inject(NotificationService);
  private _pythonService = inject(PythonService);
  private _backendService = inject(BackendService);
  private _errorService = inject(ErrorService);
  private toastr = inject(ToastrService);
  private router = inject(Router);

  protected disabled: boolean = true;
  protected loading: boolean = false;
  protected readonly value = new BehaviorSubject<string>('');
  protected hidePassword = new BehaviorSubject<boolean>(true);
  
  protected onInput(event: Event) {
    this.value.next((event.target as HTMLInputElement).value);
  }
  
  protected formGroup = this._formBuilder.group({
    user_name: ['', Validators.required],
    password: ['', Validators.required],
  });

  //Métodos

  get user_nameInput(): FormControl { return this.formGroup.controls.user_name as FormControl; }
  get passwordInput(): FormControl { return this.formGroup.controls.password as FormControl; }

  protected togglePasswordVisibility(event: MouseEvent): void {
    this.hidePassword.next(!this.hidePassword.value);
    event.stopPropagation();
  }

  public ngOnInit(): void {
    this.formGroup.statusChanges.subscribe(status => {
      this.disabled = status !== 'VALID';
    });
  }

  protected login(): void {

    if (this.formGroup.valid) {

      const login: Login = {
        user_name: this.user_nameInput.value,
        password: this.passwordInput.value,
      };

      this.loading = true;
      this.disabled = true;

      this._pythonService.login(login).subscribe({
        next: (token) => {
          localStorage
            .setItem('token', token.token);
          sessionStorage
            .setItem('usuario', this.user_nameInput.value);
          this.loading = false;
          this.disabled = false;
          this._notifications.hideBadge();
          this.router.navigate(['/dashboard']);
        },
        error: (e: HttpErrorResponse) => {
          this.toastr.error("Hubo un problema al intentar acceder","Error", {
            toastClass: 'ngx-toastr my-toast',
            positionClass: 'toast-bottom-right'
          });
          this.loading = false;
          this.disabled = false;
          this.user_nameInput.reset();
          this.passwordInput.reset();
        }
      });
    }
  }
}