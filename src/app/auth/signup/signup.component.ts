import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Subscription } from 'rxjs';

@Component({
    selector:'app-signup',
    templateUrl:'./signup.component.html',
    styleUrls:['./signup.component.css']
})
export class SignUpComponent implements OnInit, OnDestroy {
  

    isLoading =false;
    private authStatusSub : Subscription;

    constructor(public authService:AuthService){
       

    }

    ngOnInit(): void {
        this.authStatusSub = this.authService.getAuthStatusListener().subscribe(authStatus=>{
            this.isLoading =false; 
        });  
    }

    onSignup(form:NgForm){
        console.log(form.value);
        if(form.invalid){
            return;
        }else{
            this.isLoading =true;
            this.authService.createuser(form.value.email, form.value.password);
        }

    }

    ngOnDestroy(): void {
        this.authStatusSub.unsubscribe();
    }
}