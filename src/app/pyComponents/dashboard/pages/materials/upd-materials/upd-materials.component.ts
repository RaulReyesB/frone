import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatOption } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatDivider } from '@angular/material/divider';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { PythonService } from '../../../../../core/services/python.service';
import { SnackbarService } from '../../../../../core/services/snackbar.service';
import { Material, NoIDMaterial, UserID } from '../../../../../core/interfaces/python-interfaces';

@Component({
  selector: 'app-upd-materials',
  standalone: true,
  imports: [MatIcon, MatDivider, MatFormField, MatLabel, MatInput, MatError, MatSelect, MatOption, ReactiveFormsModule, MatDialogModule, MatButton],
  templateUrl: './upd-materials.component.html',
  styles: ``
})
export class UpdMaterialsComponent implements OnInit {

  private _pythonService = inject(PythonService);
  private _formBuilder = inject(NonNullableFormBuilder);
  private _snackbarService = inject(SnackbarService);
  protected disabled: boolean = true;
  protected formGroup = this._formBuilder.group({
    material_type: ['', Validators.required],
    brand: ['', Validators.required],
    model: ['', Validators.required],
    state: ['', Validators.required],
  });

  get material_typeInput(): FormControl { return this.formGroup.controls.material_type as FormControl; }
  get brandInput(): FormControl { return this.formGroup.controls.brand as FormControl; }
  get modelInput(): FormControl { return this.formGroup.controls.model as FormControl; }
  get stateInput(): FormControl { return this.formGroup.controls.state as FormControl; }

  protected idMterial: number = this.data.id;
  protected dataMaterial: NoIDMaterial = this.data.materialData;

  //Methods

  constructor(@Inject(MAT_DIALOG_DATA) public data: any)  { }

  public ngOnInit(): void {
  if (this.dataMaterial) {
    this.formGroup.patchValue(this.dataMaterial);

    this.formGroup.valueChanges.subscribe(() => {
      this.disabled = !this.formGroup.valid;
      });
    }
  }

  protected updateMaterial(): void {
    if (this.formGroup.valid) {
      this.disabled = true;

      const materialUpdate: NoIDMaterial = {
        material_type: this.material_typeInput.value,
        brand: this.brandInput.value,
        model: this.modelInput.value,
        state: this.stateInput.value
      };

      this._pythonService.updateMaterial(this.idMterial, materialUpdate).subscribe(
        () => {
          this._snackbarService.openSnackBar('Material actualizado correctamente');
        },
        (error) => {
          this._snackbarService.openSnackBar('Error al actualizar el material');
        }
      );
    }
  }
}
