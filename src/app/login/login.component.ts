import { Component, Inject, OnInit, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../_services/authentication.service';

@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.css']
})

export class LoginComponent implements OnInit, AfterViewInit {
    constructor(public dialogRef: MatDialogRef<LoginComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private authService: AuthenticationService,
        private fb: FormBuilder) {
        this.createForm();
    }

    private formSubmitAttempt!: boolean;
    public loginForm: FormGroup;
    public  hide = true;

    createForm() {
        this.loginForm = this.fb.group({
            Username: ['', Validators.required],
            Password: ['', Validators.required]
        });
    }

    ngOnInit() {

    }

     ngAfterViewInit() {

     }

    close() {
        this.dialogRef.close('Cancelled');
    }

    onSubmit() {
        this.formSubmitAttempt = true;

        if (this.loginForm.valid) {
            this.authService.login(this.loginForm.get('Username').value,
                                   this.loginForm.get('Password').value).then((response: any) => {
                if (this.authService.isLoggedIn) {
                    this.dialogRef.close('Success');
                } else {
                    this.dialogRef.close('Failed');
                }
            }).catch(err => this.dialogRef.close('Failed'));
        }
    }

    isFieldInvalid(field: string) {
        return (
            (!this.loginForm.get(field).valid && this.loginForm.get(field).touched) ||
            (this.loginForm.get(field).untouched && this.formSubmitAttempt)
        );
    }
}
