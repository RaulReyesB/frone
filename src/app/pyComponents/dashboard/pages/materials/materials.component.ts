import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';

import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import { PythonService } from '../../../../core/services/python.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { Material, NoIDMaterial } from '../../../../core/interfaces/python-interfaces';
import { RegMaterialsComponent } from './reg-materials/reg-materials.component';
import { UpdMaterialsComponent } from './upd-materials/upd-materials.component';

@Component({
  selector: 'app-materials',
  standalone: true,
  imports: [SpinnerComponent, MatButton, MatTableModule, MatFormField, MatDialogModule, MatPaginatorModule, MatInput, MatIcon, MatLabel, RouterModule],
  templateUrl: './materials.component.html',
  styles: ``
})
export default class MaterialsComponent implements OnInit, AfterViewInit {

  private _pythonService = inject(PythonService);
  private _snackbarService = inject(SnackbarService)
  protected readonly dialog = inject(MatDialog);
  private material: Material[] = [];
  protected loading: boolean = false;
  protected displayedColumns: string[] = [
    'id',
    'material_type',
    'brand',
    'model',
    'state',
    'actions'
  ];
  protected dataSource = new MatTableDataSource<Material>(this.material);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  //Methods

  public ngOnInit(): void {
    this.loading = true;
    this.getMaterials();    
  }
  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
  }
  public reload(): void {
    this.loading = true;
    this.getMaterials();
  }
  protected applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  private getMaterials(): void {
    this._pythonService.getMaterials().subscribe((data) => {
        this.material = data;
        this.dataSource.data = this.material;
        this.loading = false;        

        setTimeout(() => {
          this.dataSource.paginator = this.paginator;
        });
      },
      (error: any) => {
        this._snackbarService.openSnackBar('Error al obtener los materiales');
        this.loading = false;
      }
    );
  } 
  protected abrirRegistrarMaterial(): void {
    const dialogRef = this.dialog.open(RegMaterialsComponent, {
      width: '85%',
      panelClass: 'transparent',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.reload();
    });
  }
  protected editMaterial(id: number): void {
    const materialData = this.material.find((material) => material.ID_Material === id);
    if (materialData) {
      const dialogRef = this.dialog.open(UpdMaterialsComponent, {
        width: '85%',
        panelClass: 'transparent',
        disableClose: true,
        data: {id, materialData}
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.reload();
      });
    }
  }
  protected deleteMaterial(id: number): void {
    this._pythonService.deleteMaterial(id).subscribe(
      (data) => {
        this._snackbarService.openSnackBar('Material eliminado correctamente');
        this.reload();
      },
      (error: any) => {
        this._snackbarService.openSnackBar('Error al eliminar el material');
      }
    );
  }
}
