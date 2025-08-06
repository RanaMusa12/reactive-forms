import { Component, OnInit ,DestroyRef, inject} from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {of} from 'rxjs';
function mustContainQuestionMark(control : AbstractControl){

  if(control.value.includes('?')){
    return null;
  }
  return{ doesNotContainQuestionMark: true};

}

function emailIsUnique (control:AbstractControl){

  if(control.value !== 'test@example.com'){
    return of(null);
  }
  return of({notUniqe : true});
}

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  imports: [ReactiveFormsModule]
})


export class LoginComponent implements OnInit{

  private destroyRef = inject(DestroyRef);

  form = new FormGroup({
    email: new FormControl('',{
      validators: [Validators.email, Validators.required],

    }),
    password: new FormControl('',{

      validators: [Validators.required, Validators.minLength(5),mustContainQuestionMark ],
      asyncValidators:[emailIsUnique],
    }),
  });

  onSubmit(){
    // this.form.value.email
    const email = this.form.value.email;
    const passworrd = this.form.value.password;
    console.log(email);
  }

  get passwordInvalid(){
    return(
    this.form.controls.password.touched &&
    this.form.controls.password.dirty &&
    this.form.controls.password.invalid 

    );

  }

  ngOnInit(){
const subscription = this.form.valueChanges.subscribe({
  next: (value) =>{
    window.localStorage.setItem('SAVED-LOGIN-FORM', JSON.stringify({email: value.email}))
  }
});

  this.destroyRef.onDestroy(() => subscription.unsubscribe())


  }


}
