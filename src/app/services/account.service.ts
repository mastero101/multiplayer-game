import { Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

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
  private apiUrl2 = 'http://localhost:5000/account';
  private apiUrl = 'https://rpg21-game-backend.vercel.app/account';

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

  // Method to login to an account
  login(credentials: { username: string, password: string }): Observable<AxiosResponse<any>> {
    return new Observable((observer) => {
      this.axiosInstance
        .post('/login', credentials)
        .then((response) => {
          // Store the token in localStorage
          if (response.data.token) {
            sessionStorage.setItem('authToken', response.data.token);
            sessionStorage.setItem('accountId', response.data.accountId);
          }
          observer.next(response);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  // Method to logout from an account
  logout(): void {
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('accountId');
  }
}
