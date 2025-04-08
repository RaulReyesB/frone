import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, ReplaySubject, Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { Component, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDivider } from '@angular/material/divider';
import { DataSource } from '@angular/cdk/collections';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


import { RegisterInputsComponent } from '../registerInputs/registerInputs.component';
import { NotificationService } from '../../../../../core/services/notification.service';
import { SpinnerComponent } from '../../../../../shared/spinner/spinner.component';
import { SnackbarService } from '../../../../../core/services/snackbar.service';
import { BackendService } from '../../../../../core/services/backend.service';
import { Notificacion } from '../../../../../core/interfaces/notificacion';
import { BlockService } from '../../../../../core/services/block.service';
import { ErrorService } from '../../../../../core/services/error.service';
import { Expediente } from '../../../../../core/interfaces/patente';
import { DialogConfirmComponent } from './dialogConfirm.component';

@Component({
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, RegisterInputsComponent, MatIconModule, MatTableModule, MatFormFieldModule, SpinnerComponent, FormsModule, MatButtonModule, MatDivider],
    selector: 'app-register-dialog',
    templateUrl: './register-dialog.component.html',
})
export class RegisterDialogComponent implements OnInit {

  //Atributos

  private _notificationService = inject(NotificationService);
  private _blockService = inject(BlockService);
  private _snackbarService = inject(SnackbarService);
  private _backendService = inject(BackendService);
  private _errorService = inject(ErrorService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private regex = /^MX\/[auf]\/\d{4}\/\d{6}$/;
  private subscription!: Subscription;

  protected loading: boolean = false;
  protected registerDisplayedColumns: string[] = ['no', 'noExpediente', 'acciones'];
  protected expedientes: Expediente[] = [{ noExpediente: '' }];
  protected registerDataSource = new ExpedienteDataSource(this.expedientes);
  protected buttonEnable: boolean = false;
  protected readonly dialog = inject(MatDialog);

  //Métodos

  public ngOnInit(): void {
    this.subscription = this._blockService.getEstadoButtonSeeder().subscribe(
      (enable: boolean) => {
        this.buttonEnable = enable;
      }
    );
  }

  public get emptyExpedient(): boolean {
    return this.expedientes.some(exp => exp.noExpediente.trim() === '');
  }

  protected openRegisterDialog(): void {
    let camposInvalidos: number[] = [];

    for (let i = 0; i < this.expedientes.length; i++) {
      const noExpediente = this.expedientes[i].noExpediente.trim();
      if (!this.regex.test(noExpediente)) {
        camposInvalidos.push(i + 1);
      }
    }

    if (camposInvalidos.length > 0) {
      this._snackbarService.openSnackBar('Verifica que los expedientes cumplan con la estructura adecuada antes de insertar. \n La estructura debe ser "MX/a|u|f/aaaa/nnnnnn:" o no estén vacíos');
      return;
    }

    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      data: { expedientes: this.expedientes }
    });

    dialogRef.componentInstance.confirm.subscribe(() => {
      this.enviarPatentes();
    });

    dialogRef.afterClosed().subscribe(result => {});
  }


  protected addExpediente(): void {
    const lastExpediente = this.expedientes[this.expedientes.length - 1].noExpediente.trim();
    if (lastExpediente === '') {
      this._snackbarService.openSnackBar('No se puede agregar un nuevo expediente si el anterior está vacío');
      return;
    }

    let camposInvalidos: number[] = [];

    for (let i = 0; i < this.expedientes.length; i++) {
      const noExpediente = this.expedientes[i].noExpediente.trim();
      if (!this.regex.test(noExpediente)) {
        camposInvalidos.push(i + 1);
      }
    }

    if (camposInvalidos.length > 0) {
      this._snackbarService.openSnackBar('Antes de ingresar un nuevo expediente, verifica que el anterior cumpla con la estructura. \n La estructura debe ser "MX/a|u|f/aaaa/nnnnnn:"');
      return;
    }

    this.expedientes.push({ noExpediente: '' });
    this.registerDataSource.setData(this.expedientes);
    this.scrollDivBottom();
  }

  protected removeExpediente(index?: number): void {
    if (index !== undefined) {
      this.expedientes.splice(index, 1);
    } else {
      this.expedientes.pop();
    }
    this.registerDataSource.setData(this.expedientes);

    if (this.expedientes.length == 0) {
      this.expedientes.push({ noExpediente: '' });
      this.registerDataSource.setData(this.expedientes);
    }
  }

  protected enviarPatentes(): void {
    this.loading = true;
    this._blockService.bloquearButtonSeeder(false);
    
    this._backendService.insertExpediente(this.expedientes).subscribe({
      next: (response) => {
        this.loading = false;
        this._blockService.getEstadoButtonSeeder();
        this.toastr.success(`${response.msg.replace(/\n/g, '<br>')}`, 'Mensaje', {
          toastClass: 'ngx-toastr my-toast-success',
          positionClass: 'toast-bottom-right',
          enableHtml: true
        });
        for (const error of response.errores) {
          this.toastr.error(`${error.msg}`, "Error", {
            toastClass: 'ngx-toastr my-toast',
            positionClass: 'toast-bottom-right'
          });
        }
        const notificacionExito: Notificacion = {
          tipo: 'exito',
          message: response.msg,
          timestamp: new Date()
        };
        this._notificationService.agregarNotificacion(notificacionExito);
        this.expedientes = [{ noExpediente: '' }];
        this.registerDataSource.setData(this.expedientes);
        this.dialog.closeAll();
      },
      error: (error) => {
        this.loading = false;
        this._blockService.bloquearButtonSeeder(true);  // Re-enable the button in case of an error
        this._errorService.msjError(error);

        const notificacionError: Notificacion = {
          tipo: 'error',
          message: error.msg,
          timestamp: new Date()
        };
        this._notificationService.agregarNotificacion(notificacionError);
        this.dialog.closeAll();
      }
    });
  }

  public scrollDivBottom(): void {
    let div = document.getElementById('inputsRegistro');
    if (div) {
      try {
        div.scrollTo({
          top: div.scrollHeight,
          behavior: 'smooth'
        });
      } catch (error) {
      }
    }
  }

}

class ExpedienteDataSource extends DataSource<Expediente> {
  private _dataStream = new ReplaySubject<Expediente[]>();

  constructor(initialData: Expediente[]) {
    super();
    this.setData(initialData);
  }

  public connect(): Observable<Expediente[]> {
    return this._dataStream;
  }

  disconnect() {}

  public setData(data: Expediente[]): void {
    this._dataStream.next(data);
  }
}