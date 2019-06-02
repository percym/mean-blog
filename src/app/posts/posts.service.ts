import {Post} from './post.model';
import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { post } from 'selenium-webdriver/http';
import { importType } from '@angular/compiler/src/output/output_ast';
import {map} from 'rxjs/operators';
import { Content } from '@angular/compiler/src/render3/r3_ast';

@Injectable({providedIn:'root'})
export class PostsService{
    private posts:Post []=[];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http:HttpClient){

    }
    getPosts(){
        this.http.get<{message:string, posts: any}>('http://localhost:3000/api/posts')
        // .pipe(map((postData)=>{
        //     return postData.posts.map(post=> {
        //         return {
        //         title : post.title,
        //         content : post.content,
        //         id : post._id 
        //         }
        //     });
        // }))
        .subscribe((transformedPosts)=>{
            console.log('____________________posts');
            console.log(transformedPosts);
            this.posts = transformedPosts.posts;
            this.postsUpdated.next([...this.posts]);
        });
    }

    getPostsUpdatedListener(){
        return this.postsUpdated.asObservable();
    }

    createPosts(title:string ,content:string){
         const post : Post ={id:null,title:title , content:content};
         this.http.post<{message:string}>('http://localhost:3000/api/posts', post)
         .subscribe((resData)=>{
             this.posts.push(post);
             this.postsUpdated.next([...this.posts]);
         });
        
    }
}