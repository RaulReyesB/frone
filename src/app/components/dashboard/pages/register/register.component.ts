import { AfterViewInit, Component, OnInit, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { SpinnerComponent } from '../../../../shared/spinner/spinner.component';
import { RegisterDialogComponent } from './dialogs/register-dialog.component';
import { BackendService } from '../../../../core/services/backend.service';
import { SeeResumeFull } from './dialogs/seeFulResume.component';
import { Patente } from '../../../../core/interfaces/patente';
import { BlockService } from '../../../../core/services/block.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [SpinnerComponent, MatButton, MatTableModule, MatFormField, MatDialogModule, MatPaginatorModule, MatInput, MatIcon, MatLabel, RouterModule],
  templateUrl: './register.component.html'
})
export default class RegisterComponent implements OnInit, AfterViewInit {

  //Atributos
  private listExpedientes: Patente[] = [];

  protected loading: boolean = false;
  protected displayedColumns: string[] = [
    'posicion',
    'status',
    'noExpediente',
    'fechaPresentacion',
    'solicitantes',
    'inventores',
    'titulo',
    'resumen',
  ];
  protected dataSource = new MatTableDataSource<Patente>(this.listExpedientes);
  protected readonly dialog = inject(MatDialog);
  protected buttonEnable: boolean = true;
  protected buttonNotificaciones: boolean = true;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
  private _backendService = inject(BackendService);
  private _blockService = inject(BlockService);
  private changeDetector = inject(ChangeDetectorRef);
  private router = inject(Router);

  //Métodos

  public ngOnInit(): void {
    this.loading = true;
    this.getExpedientes();    
    this._blockService.getEstadoButtonHistorico().subscribe(
      (enable: boolean) => {
        this.buttonEnable = enable;
      }
    )
    this._blockService.getEstadoButtonNotificaciones().subscribe(
      (enable: boolean) => {
        this.buttonNotificaciones = enable;
      }
    )
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
    });
  }

  public reload(): void {
    this.loading = true;
    this.getExpedientes();
    this.changeDetector.detectChanges();
  }

  protected applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  protected abrirVidoc(expediente: Patente): void {
    this.router.navigate(['/dashboard/vidoc', expediente]);    
  }

  protected openDialog(contenido: string): void {
    this.dialog.open(SeeResumeFull, {
      data: { contenido },
    });
  }

  protected iniciarScraperHistorico(): void {
    this._backendService.launchScraperHistorico().subscribe(() => {
      this._blockService.bloquearButtonHistorico(false);
    })
  }

  protected iniciarScraperNotificaciones(): void {
    this._backendService.launchScraperNotificaciones().subscribe(() => {
      this._blockService.bloquearButtonNotificaciones(false);
    })
  }

  protected abrirRegistrar(): void {
    this.dialog.open(RegisterDialogComponent, {
      width: '85%'
    })
  }

  protected imprimirStr(arreglito: any[] | null, type: 'Institutos' | 'Inventores'): string {
    if (!arreglito) return 'Por definir';
  
    if (type === 'Institutos') {
      return arreglito.map((obj) => `• ${obj.razonSocial}`).join('<br>');
    } else if (type === 'Inventores') {
      return arreglito.map((obj) => `• ${obj.nombreCompleto}`).join('<br>');
    }
    return '';
  }

  private getExpedientes(): void {
    this._backendService.getExpedientes().subscribe((data) => {
      this.listExpedientes = data.sort((a, b) => {
        const aHasData = this.hasRequiredData(a);
        const bHasData = this.hasRequiredData(b);
        return aHasData === bHasData ? 0 : aHasData ? -1 : 1;
      });

      this.listExpedientes.forEach((expediente, index) => {
        expediente.posicion = index + 1;
      });

      this.dataSource.data = this.listExpedientes;
      this.loading = false;

      setTimeout(() => {
        this.dataSource.paginator = this.paginator;
      });
    });
  }

  private hasRequiredData(expediente: Patente): boolean {
    return !!(
      expediente.titulo &&
      expediente.resumen &&
      expediente.fechaPresentacion &&
      expediente.solicitantes &&
      expediente.inventores
    );
  }

}
