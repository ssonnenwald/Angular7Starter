import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './_services/authentication.service';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { LoginComponent } from './login/login.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar) {
            this.isLoggedIn$ = new Observable(ob => {ob.next(false); });
    }

    public isLoggedIn$: Observable<boolean>;
    private isLoggedIn = false;

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    onLoginLogout(): void {
        this.isLoggedIn$.subscribe(val => { this.isLoggedIn = val; });

        if (this.isLoggedIn) {
            this.authenticationService.logout();
        } else {
            const dialogRef = this.dialog.open(LoginComponent, {
                width: '500px',
                data: {
                        title: 'Login'
                }
            });

        dialogRef.afterClosed()
            .subscribe(dialogResult => {
                switch (dialogResult) {
                    case 'Success': {
                        this.snackBar.open('Successfully logged.');
                       break;
                    }
                    case 'Failed': {
                        this.snackBar.open('Failed to login.');
                        break;
                     }
                    case 'Cancelled': {
                       // Do nothing, because dialog was closed without saving.
                       break;
                    }
                    default: {
                        // An error occurred so display the error message.
                        if (dialogResult !== undefined) {
                            this.snackBar.open(dialogResult);
                        }

                        break;
                    }
                 }
            });
        }
    }
}
