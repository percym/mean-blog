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
    private tokenTimer : any;
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
        this.http.post<{token:string, expiresIn:number}>('http://localhost:3000/api/user/login', authData)
        .subscribe(response =>{
            this.token = response.token;
            if(this.token ){
            const expiresInDuration = response.expiresIn;
            this.setAuthTimer(expiresInDuration);    
            this.authStatusListener.next(true);
            this.isAuthenticated =true;
            const now = new Date();
            console.log(" ---- now--- " + now);
            const expirationDate= new Date(now.getTime()+ (expiresInDuration * 1000));
            console.log(" ---- expirationDate--- " + expirationDate);
            this.saveAuthData(this.token,expirationDate);
            this.router.navigate(['/']);
            }
           
        });
    }

    autoAuthUser(){
        const authInformation = this.getAuthData();
        const now = new Date();

        // const isInFuture = authInformation.expirationDate> now;
         const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
        if(expiresIn > 0){
            this.token = authInformation.token;
            this.isAuthenticated =true;
            this.setAuthTimer(expiresIn)
            this.authStatusListener.next(true);
        }
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
        clearTimeout(this.tokenTimer);
        this.router.navigate(['/']);
    }

    saveAuthData(token:string , expirationDate:Date){
        localStorage.setItem('token',token);
        localStorage.setItem('expiration',expirationDate.toISOString());
    }

    clearAuthData(){
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
    }

    private getAuthData(){
       const token = localStorage.getItem('token');
       const expirationDate =localStorage.getItem('expiration');

       if(!token || !expirationDate){
           return;
       }

       return {
           token:token,
           expirationDate:new Date (expirationDate)
       }
    }

    private setAuthTimer(duration : number){
        console.log("setting timer: " + duration);
        this.tokenTimer = setTimeout(()=>{
            this.logout();

        },duration * 1000)
    }
}