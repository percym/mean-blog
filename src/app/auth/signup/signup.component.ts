import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
    selector:'app-signup',
    templateUrl:'./signup.component.html',
    styleUrls:['./signup.component.css']
})
export class SignUpComponent {

    isLoading =false;

    constructor(public authService:AuthService){

    }

    onSignup(form:NgForm){
        console.log(form.value);
        if(form.invalid){
            return;
        }else{
            this.authService.createuser(form.value.email, form.value.password);
        }
        
    }
}5