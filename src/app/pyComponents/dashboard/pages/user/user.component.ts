import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { PythonService } from '../../../../core/services/python.service';
import { UserID } from '../../../../core/interfaces/python-interfaces';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import RegUserComponent from './reg-user/reg-user.component';
import { UpdUserComponent } from './upd-user/upd-user.component';
import { SnackbarService } from '../../../../core/services/snackbar.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [SpinnerComponent, MatButton, MatTableModule, MatFormField, MatDialogModule, MatPaginatorModule, MatInput, MatIcon, MatLabel, RouterModule],
  templateUrl: './user.component.html',
  styles: ``
})
export default class UserComponent implements OnInit, AfterViewInit {

  private _pythonService = inject(PythonService);
  private _snackbarService = inject(SnackbarService)
  protected readonly dialog = inject(MatDialog);
  private user: UserID[] = [];
  protected loading: boolean = false;
  protected displayedColumns: string[] = [
    'id',
    'name',
    'last_name',
    'type_user',
    'user_name',
    'email',
    'phone_number',
    'status',
    'registration_date',
    'update_date',
    'actions'
  ];
  protected dataSource = new MatTableDataSource<UserID>(this.user);

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  //Methods

  ngOnInit(): void {
    this.loading = true;
    this.getUsers();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
  }

  public reload(): void {
    this.loading = true;
    this.getUsers();
  }

  protected applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  private getUsers(): void {
    this._pythonService.getUser().subscribe((data) => {
      this.user = data;
      this.dataSource.data = this.user;
      this.loading = false;

      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      });
    },
    (error: any) => {
      this._snackbarService.openSnackBar('Error al obtener los materiales');
      this.loading = false;
    });
  }

  protected abrirRegistrar(): void {
    const dialogRef = this.dialog.open(RegUserComponent, {
      width: '85%',
      disableClose: true,
      panelClass: 'transparent'
    });
    dialogRef.afterClosed().subscribe((result) => {
      this.reload();
    });
  }

  protected deleteUser(id: number): void {
    this._pythonService.deleteUser(id).subscribe(() => {
      this._snackbarService.openSnackBar('Usuario eliminado correctamente');
      this.reload();
    });
  }
  protected editUser(id: number): void {
    const userData = this.user.find(u => u.id === id); 
    if (userData) {
      const dialogRef = this.dialog.open(UpdUserComponent, {
        disableClose: true,
        panelClass: 'transparent',
        data: { id, userData }, 
        width: '85%'
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.reload();
      });
    }
  }

}
