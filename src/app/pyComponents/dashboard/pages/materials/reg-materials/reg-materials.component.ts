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
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { BehaviorSubject } from 'rxjs';
import { PythonService } from '../../../../../core/services/python.service';
import { SnackbarService } from '../../../../../core/services/snackbar.service';
import { NoIDMaterial } from '../../../../../core/interfaces/python-interfaces';

@Component({
  selector: 'app-reg-materials',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatTableModule, MatFormFieldModule, FormsModule, MatButtonModule, MatDivider, ReactiveFormsModule, CommonModule, MatCheckboxModule, MatSelect, MatOption, MatInput],
  templateUrl: './reg-materials.component.html',
  styles: ``
})
export class RegMaterialsComponent implements OnInit {

  private _pythonService = inject(PythonService);
  private _formBuilder = inject(NonNullableFormBuilder);
  private _snackbarService = inject(SnackbarService);

  protected disabled: boolean = true;
  protected disableSelect = new FormControl(false);
  protected hidePassword = new BehaviorSubject<boolean>(true);
  protected formGroup = this._formBuilder.group({
    material_type: ['', Validators.required],
    brand: ['', Validators.required],
    model: ['', Validators.required],
    state: ['', Validators.required],
  });
  value: any

  get material_typeInput(): FormControl { return this.formGroup.controls.material_type as FormControl; }
  get brandInput(): FormControl { return this.formGroup.controls.brand as FormControl; }
  get modelInput(): FormControl { return this.formGroup.controls.model as FormControl; }
  get stateInput(): FormControl { return this.formGroup.controls.state as FormControl; }

  public ngOnInit(): void {
    this.formGroup.valueChanges.subscribe(() => {
      this.disabled = !this.formGroup.valid;
    });
  }

  protected onInput(event: Event) {
    this.value.next((event.target as HTMLInputElement).value);
  }

  protected newMaterial(): void {
    if (this.formGroup.valid) {

      this.disabled = true;

      const material: NoIDMaterial = {
        material_type: this.material_typeInput.value,
        brand: this.brandInput.value,
        model: this.modelInput.value,
        state: this.stateInput.value,
      }      
      this._pythonService.createMaterial(material).subscribe(
        () => {
        this._snackbarService.openSnackBar('Material registrado exitosamente');
        },
        (error) => {
          this._snackbarService.openSnackBar('Error al registrar el material');          
        }
      );
    }
  }
}