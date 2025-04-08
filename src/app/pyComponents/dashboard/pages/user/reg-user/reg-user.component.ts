import { FormControl, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {MatOption, MatSelect, MatSelectModule} from '@angular/material/select';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatInput } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

import { SnackbarService } from '../../../../../core/services/snackbar.service';
import { PythonService } from '../../../../../core/services/python.service';
import { User } from '../../../../../core/interfaces/python-interfaces';

@Component({
  selector: 'app-reg-user',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatTableModule, MatFormFieldModule, FormsModule, MatButtonModule, MatDivider, ReactiveFormsModule, CommonModule, MatCheckboxModule, MatSelect, MatOption, MatInput],
  templateUrl: './reg-user.component.html',
  styles: ``
})
export default class RegUserComponent implements OnInit {

  private _pythonService = inject(PythonService);
  private _formBuilder = inject(NonNullableFormBuilder);
  private _snackbarService = inject(SnackbarService);

  protected disabled: boolean = true;
  protected disableSelect = new FormControl(false);
  protected hidePassword = new BehaviorSubject<boolean>(true);
  protected formGroup = this._formBuilder.group({
    name: ['', Validators.required],
    last_name: ['', Validators.required],
    type_user: ['', Validators.required],
    user_name: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    phone_number: ['', Validators.required],
    status: ['', Validators.required],
  });
  value: any;

  get nameInput(): FormControl { return this.formGroup.controls.name as FormControl; }
  get last_nameInput(): FormControl { return this.formGroup.controls.last_name as FormControl; }
  get type_userInput(): FormControl { return this.formGroup.controls.type_user as FormControl; }
  get user_nameInput(): FormControl { return this.formGroup.controls.user_name as FormControl; }
  get emailInput(): FormControl { return this.formGroup.controls.email as FormControl; }
  get passwordInput(): FormControl { return this.formGroup.controls.password as FormControl; }
  get phone_numberInput(): FormControl { return this.formGroup.controls.phone_number as FormControl; }
  get statusInput(): FormControl { return this.formGroup.controls.status as FormControl; }

  public ngOnInit(): void {
    this.formGroup.valueChanges.subscribe(() => {
      this.disabled = !this.formGroup.valid;
    });
  }

  protected togglePasswordVisibility(event: MouseEvent): void {
    this.hidePassword.next(!this.hidePassword.value);
    event.stopPropagation();
  }
  protected onInput(event: Event) {
    this.value.next((event.target as HTMLInputElement).value);
  }
  
  protected newUser(): void { 
    if(this.formGroup.valid) {

      this.disabled = true;

      const user: User = {
        name: this.formGroup.value.name!,
        last_name: this.formGroup.value.last_name!,
        type_user: this.formGroup.value.type_user!,
        user_name: this.formGroup.value.user_name!,
        email: this.formGroup.value.email!,
        password: this.formGroup.value.password!,
        phone_number: this.formGroup.value.phone_number!,
        status: this.formGroup.value.status!,
        registration_date: new Date(),
        update_date: new Date()
      };

      this._pythonService.createUser(user).subscribe(
        () => {
          this._snackbarService.openSnackBar('Usuario creado correctamente');
        },
        (error) => {
          this._snackbarService.openSnackBar('Error al crear el usuario');
        }
      );
    }

  }

}
