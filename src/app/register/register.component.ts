import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService, AccountData } from '../services/account.service'; // Use the Axios service
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule, 
    MatSnackBarModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})

export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  submitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private accountService: AccountService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group(
      {
        username: ['', [Validators.required, Validators.minLength(3)]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: this.mustMatch('password', 'confirmPassword'),
      }
    );
  }

  // Getters para facilitar el acceso a los campos del formulario
  get f() {
    return this.registerForm.controls;
  }

  // Custom validator para confirmar la coincidencia de contraseñas
  mustMatch(password: string, confirmPassword: string) {
    return (formGroup: FormGroup) => {
      const control = formGroup.controls[password];
      const matchingControl = formGroup.controls[confirmPassword];

      if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
        return;
      }

      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ mustMatch: true });
      } else {
        matchingControl.setErrors(null);
      }
    };
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    this.accountService.register(this.registerForm.value).subscribe({
      next: (data) => {
        console.log('Account created successfully:', data);
        this.snackBar.open('Account created successfully!', 'Close', {
          duration: 3000, // Duración en milisegundos
          panelClass: ['snackbar-success'] // Clase CSS opcional
        });
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error creating account:', error);
        this.snackBar.open('Error creating account. Please try again.', 'Close', {
          duration: 3000,
          panelClass: ['snackbar-error'] // Clase CSS opcional
        });
      }
    });
  }
}
