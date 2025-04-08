import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import { PythonService } from '../../../../core/services/python.service';
import { SnackbarService } from '../../../../core/services/snackbar.service';
import { Loan } from '../../../../core/interfaces/python-interfaces';
import { RegLoansComponent } from './reg-loans/reg-loans.component';

@Component({
  selector: 'app-loans',
  standalone: true,
  imports: [SpinnerComponent, MatButton, MatTableModule, MatFormField, MatDialogModule, MatPaginator, MatInput, MatIcon, MatLabel, RouterModule],
  templateUrl: './loans.component.html',
  styles: ``
})
export default class LoansComponent implements OnInit, AfterViewInit {
  
  private _pythonService = inject(PythonService);
  private _snackbarService = inject(SnackbarService)
  protected readonly dialog = inject(MatDialog);
  protected loading: boolean = false;
  private loan: Loan[] = [];
  protected dataSource = new MatTableDataSource<Loan>(this.loan);
  protected displayedColumns: string[] = ['id', 'user', 'material', 'loan_date', 'return_date','status', 'actions'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  public ngOnInit(): void {
    this.loading = true;
    this.getLoans();
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
  }
  public reload(): void {
    this.loading = true;
    this.getLoans();
  }
  protected applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  private getLoans(): void {
    this._pythonService.getLoans().subscribe((data) => {
        this.loan = data;
        this.dataSource.data = this.loan;
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

  protected abrirREgistrarLoan(): void {
      const dialogRef = this.dialog.open(RegLoansComponent, {
        width: '85%',
        panelClass: 'transparent',
        disableClose: true
      });
      dialogRef.afterClosed().subscribe((result) => {
        this.reload();
      });
    }

}
