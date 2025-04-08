import { Component, Inject, inject, Input, OnInit } from '@angular/core';
import { NonNullableFormBuilder, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';

import { PythonService } from '../../../../../core/services/python.service';
import { SnackbarService } from '../../../../../core/services/snackbar.service';
import { User } from '../../../../../core/interfaces/python-interfaces';
import { MatIcon } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-upd-user',
  standalone: true,
  imports: [MatIcon, MatDivider, MatFormField, MatLabel, MatInput, MatError, MatSelect, MatOption, ReactiveFormsModule, MatDialogModule, MatButton],
  templateUrl: './upd-user.component.html',
  styles: ''
})
export class UpdUserComponent implements OnInit {

  private _pythonService = inject(PythonService);
  private _formBuilder = inject(NonNullableFormBuilder);
  private _snackbarService = inject(SnackbarService);

  protected disabled: boolean = true;
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

  @Input() userData!: User;

  get nameInput(): FormControl { return this.formGroup.controls.name as FormControl; }
  get last_nameInput(): FormControl { return this.formGroup.controls.last_name as FormControl; }
  get type_userInput(): FormControl { return this.formGroup.controls.type_user as FormControl; }
  get user_nameInput(): FormControl { return this.formGroup.controls.user_name as FormControl; }
  get emailInput(): FormControl { return this.formGroup.controls.email as FormControl; }
  get passwordInput(): FormControl { return this.formGroup.controls.password as FormControl; }
  get phone_numberInput(): FormControl { return this.formGroup.controls.phone_number as FormControl; }
  get statusInput(): FormControl { return this.formGroup.controls.status as FormControl; }

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  protected idUser: number = this.data.id;
  protected userDataa: User = this.data.userData;

  public ngOnInit(): void {
    if (this.userDataa) {
      this.formGroup.patchValue(this.userDataa);
    }

    this.formGroup.valueChanges.subscribe(() => {
      this.disabled = !this.formGroup.valid;
    });
  }

  protected togglePasswordVisibility(event: MouseEvent): void {
    this.hidePassword.next(!this.hidePassword.value);
    event.stopPropagation();
  }

  protected updateUser(): void {
    if (this.formGroup.valid) {
      this.disabled = true;

      const updatedUser: User = {
        name: this.formGroup.value.name!,
        last_name: this.formGroup.value.last_name!,
        type_user: this.formGroup.value.type_user!,
        user_name: this.formGroup.value.user_name!,
        email: this.formGroup.value.email!,
        password: this.formGroup.value.password!,
        phone_number: this.formGroup.value.phone_number!,
        status: this.formGroup.value.status!,
        update_date: new Date(),
        registration_date: this.userDataa.registration_date
      };      

      this._pythonService.updateUser(this.idUser, updatedUser).subscribe(
        () => {
          this._snackbarService.openSnackBar('Usuario actualizado correctamente');
        },
        (error) => {
          this._snackbarService.openSnackBar('Error al actualizar el usuario');
        }
      );
    }
  }
}