import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';

@Injectable({providedIn:'root'})
export class AuthService{
    private isAuthenticated = false;
    private token :string;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient , private router:Router){

    }
    createuser(email:string , password:string){
        const authData:AuthData ={email:email, password:password};
        this.http.post('http://localhost:3000/api/user/signup', authData)
        .subscribe(response =>{
            console.log(response);
        });
         
    }

    login(email:string , password:string){
        const authData:AuthData ={email:email, password:password};
        this.http.post<{token:string}>('http://localhost:3000/api/user/login', authData)
        .subscribe(response =>{
            console.log(response);
            this.token = response.token;
            if(this.token ){
            this.authStatusListener.next(true);
            }
            this.isAuthenticated =true;
            this.router.navigate(['/']);
        });
    }

    getToken(){
        return this.token;
    }

     getAuthStatusListener(){
        return this.authStatusListener.asObservable();
    }

    getIsAuthenticated(){
        return this.isAuthenticated;
    }

    logout(){
        this.token = null;
        this.isAuthenticated=false;
        this.authStatusListener.next(false);
        this.router.navigate(['/']);
    }
}