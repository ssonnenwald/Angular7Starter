import { Component, ChangeDetectorRef, ViewChild, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './_services/authentication.service';
import { MatDialog, MatSnackBar, MatSidenav } from '@angular/material';
import { Observable } from 'rxjs';
import { LoginComponent } from './login/login.component';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        public dialog: MatDialog,
        private snackBar: MatSnackBar,
        private media: MediaMatcher,
        private changeDetectorRef: ChangeDetectorRef
        ) {
            this.isLoggedIn$ = this.authenticationService.isLoggedIn;

            this.mobileQuery = this.media.matchMedia('(max-width: 992px)');
            this._mobileQueryListener = () => this.changeDetectorRef.detectChanges();
            this.mobileQuery.addListener(this._mobileQueryListener);
    }

    public displayMode = 'flat';
    public mobileQuery: MediaQueryList;

    private _mobileQueryListener: () => void;
    public isLoggedIn$: Observable<boolean>;
    private isLoggedIn = false;

    @ViewChild('sidenav') public sidenav: MatSidenav;

    ngAfterViewInit(): void {
        window.dispatchEvent(new Event('resize'));
    }

    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }

    onLoginLogout(): void {
        this.isLoggedIn$.subscribe(val => {
            this.isLoggedIn = val;
        });

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

    closeSidenav() {
        this.sidenav.close();
    }
}
