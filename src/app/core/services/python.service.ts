import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Loan, Login, Material, NoIDLoan, NoIDMaterial, UpdUser, User, UserID } from '../interfaces/python-interfaces';

@Injectable({
  providedIn: 'root'
})
export class PythonService {
  private http = inject(HttpClient);
  private API_URL = `https://pylin.onrender.com/`;

  //Login
  public login(login: Login): Observable<{ token: string }> {
    const url: string = `${this.API_URL}login`;
    return this.http.post<{ token: string }>(url, login);
  }

  //User
  public getUser(): Observable<UserID[]> {
    const url: string = `${this.API_URL}user/`;
    return this.http.get<UserID[]>(url);
  }

  public createUser(user: User): Observable<User> {
    const url: string = `${this.API_URL}user/`;
    return this.http.post<User>(url, user);
  }

  public updateUser(id: number, user: UpdUser): Observable<UpdUser> {
    const url: string = `${this.API_URL}user/${id}/`;
    return this.http.put<UpdUser>(url, user);
  }

  public deleteUser(id: number): Observable<any> {
    const url: string = `${this.API_URL}user/${id}/`;
    return this.http.delete(url);
  }

  //Materials
  public getMaterials(): Observable<any> {
    const url: string = `${this.API_URL}material/`;
    return this.http.get<Material[]>(url);
  }

  public createMaterial(material: NoIDMaterial): Observable<NoIDMaterial> {
    const url: string = `${this.API_URL}material/`;
    return this.http.post<NoIDMaterial>(url, material);
  }

  public updateMaterial(id: number, material: NoIDMaterial): Observable<NoIDMaterial> {
    const url: string = `${this.API_URL}material/${id}/`;
    return this.http.put<NoIDMaterial>(url, material);
  }
  
  public deleteMaterial(id: number): Observable<any> {
    const url: string = `${this.API_URL}material/${id}/`;
    return this.http.delete(url);
  }

  //Loans
  public getLoans(): Observable<Loan[]> {
    const url: string = `${this.API_URL}loan/`;
    return this.http.get<Loan[]>(url);
  }

  public createLoan(loan: NoIDLoan): Observable<NoIDLoan> {
    const url: string = `${this.API_URL}loan/`;
    return this.http.post<NoIDLoan>(url, loan);
  }
}
