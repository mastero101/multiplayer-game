import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';

export interface AccountData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private axiosInstance: AxiosInstance;
  private apiUrl = 'http://localhost:5000/account';

  constructor() {
    // Create a new Axios instance
    this.axiosInstance = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  // Method to register a new account
  register(accountData: AccountData): Observable<AxiosResponse<any>> {
    // Wrap Axios promise in an Observable
    return new Observable((observer) => {
      this.axiosInstance
        .post('/register', accountData)
        .then((response) => {
          observer.next(response);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
