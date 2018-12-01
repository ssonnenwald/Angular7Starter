import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from '../_models/user';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

    constructor(private http: HttpClient,
        private router: Router) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public async login(username: string, password: string): Promise<any> {
        return this.http.post<any>('${environment.config.apiUrl}/users/authenticate', { username, password })
            .pipe(map(user => {
                // login successful if there's a jwt token in the response
                if (user && user.token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }

                return user;
            }));
    }

    logout() {
        sessionStorage.removeItem('access_token');
        this.loggedIn.next(false);
        this.router.navigate(['/home']);
    }

    get isLoggedIn() {
        if (sessionStorage.getItem('access_token') != null &&
            sessionStorage.getItem('access_token') !== 'No Token') {
            // const token: string = this.jwtHelperService.tokenGetter();

            // if (token) {
            if (true) {
                // const tokenExpired: boolean = this.jwtHelperService.isTokenExpired(token);

                // if (tokenExpired) {
                if (false) {
                   this.logout();
                }
            }
        }

        return this.loggedIn.asObservable();
    }

    private handleError(error: HttpErrorResponse) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
        } else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error('Backend returned code ' + error.status + ', ' +
                'body was: ' + JSON.stringify(error.error));
        }

        // return an observable with a user-facing error message
        return throwError('Something bad happened, please try again later.');
    }
}
