import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelect } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { PythonService } from '../../../../../core/services/python.service';
import { SnackbarService } from '../../../../../core/services/snackbar.service';
import { Material, NoIDLoan, UserID } from '../../../../../core/interfaces/python-interfaces';

@Component({
  selector: 'app-reg-loans',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatTableModule, MatFormFieldModule, FormsModule, MatButtonModule, MatDivider, ReactiveFormsModule, CommonModule, MatCheckboxModule, MatSelect, MatOption,],
  templateUrl: './reg-loans.component.html',
  styles: ``
})
export class RegLoansComponent implements OnInit {

  private _pythonService = inject(PythonService);
  private _formBuilder = inject(NonNullableFormBuilder);
  private _snackbarService = inject(SnackbarService);
  protected disabled: boolean = true;
  protected materialData: Material[] = [];
  protected userData: UserID[] = [];
  protected disableSelect = new FormControl(false);
  protected formGroup = this._formBuilder.group({
    id_user: ['', Validators.required],
    id_material: ['', Validators.required],
    status: ['', Validators.required],
  });
  value: any

  get id_userInput(): FormControl { return this.formGroup.controls.id_user as FormControl; }
  get id_materialInput(): FormControl { return this.formGroup.controls.id_material as FormControl; }
  get statusInput(): FormControl { return this.formGroup.controls.status as FormControl; }
  

  public ngOnInit(): void {
    this.formGroup.valueChanges.subscribe(() => {
      this.disabled = !this.formGroup.valid;
    });
    this.getUsersAndMaterials();
  }

  protected onInput(event: Event) {
    this.value.next((event.target as HTMLInputElement).value);
  }

  protected newLoan(): void {
    if (this.formGroup.valid) {

      this.disabled = true;

      const loan: NoIDLoan = {
        id_user: this.id_materialInput.value,
        id_material: this.id_materialInput.value,
        loan_date: new Date(),
        return_date: new Date(),
        status: this.statusInput.value,
      }
      this._pythonService.createLoan(loan).subscribe(

        ()=> {
          this._snackbarService.openSnackBar('Loan registrado exitosamente');
        },
        (error) => {
          this._snackbarService.openSnackBar('Error al registrar loan');
        }
      );
    }
  }
  private getUsersAndMaterials(): void {
    this._pythonService.getMaterials().subscribe(
      (data)=>{
        this.materialData = data;
        console.log(this.materialData);
    });
    this._pythonService.getUser().subscribe(
      (data) => {
        this.userData = data;
        console.log(this.userData);
      }
    )
  }
}
