import {Post} from './post.model';
import { Injectable } from '@angular/core';
import {Subject} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { importType } from '@angular/compiler/src/output/output_ast';
import {map} from 'rxjs/operators';
import { Content } from '@angular/compiler/src/render3/r3_ast';
import { Router } from '@angular/router';

@Injectable({providedIn:'root'})
export class PostsService{
    private posts:Post []=[];
    private postsUpdated = new Subject<Post[]>();

    constructor(private http:HttpClient , private router:Router){

    }
    getPosts(){
        this.http.get<{message:string, posts: any}>('http://localhost:3000/api/posts')
        .pipe(map((postData)=>{
            return postData.posts.map(post=> {
                return {
                title : post.title,
                content : post.content,
                id : post._id, 
                imagePath:post.imagePath
                }
            });
        }))
        .subscribe(transformedPosts=>{
            console.log('____________________posts');
            console.log(transformedPosts);
            this.posts = transformedPosts;
            this.postsUpdated.next([...this.posts]);
        });
    }

    // getPost(id:string){
    //     return {...this.posts.find(p => p.id === id)};
    // }

    getPost(id:string){
        return this.http.get<{_id:string , title: string , content:string}>('http://localhost:3000/api/posts/'+id);
    }

    getPostsUpdatedListener(){
        return this.postsUpdated.asObservable();
    }

    createPosts(title:string ,content:string, image:File){

        const postData =new FormData();
        postData.append("title",title);
        postData.append("content",content);
        postData.append("image",image ,title);

         this.http.post<{message:string, post:Post}>('http://localhost:3000/api/posts', postData)
         .subscribe((resData)=>{
            const post : Post ={
                id:resData.post.id,
                title:title ,
                content:content,
                imagePath:resData.post.imagePath
                }; 
            this.posts.push(post);
            this.postsUpdated.next([...this.posts]);
            this.router.navigate(["/"]);
            });
    }

    updatePost(id:string , title :string ,content:string){
        const post ={id:id ,title:title , content:content, imagePath:null};
        this.http.put('http://localhost:3000/api/posts/'+post.id,post).
        subscribe((resp)=>{
           const updatePosts =[...this.posts];
           const oldPostIndex = updatePosts.findIndex(p => p.id === post.id);
           updatePosts[oldPostIndex] = post;
           this.posts = updatePosts;
           this.postsUpdated.next([...this.posts]);
           this.router.navigate(["/"]);
        });
    }


    deletePost(postId:String ){
        this.http.delete('http://localhost:3000/api/posts/'+postId)
        .subscribe(()=>{
            const updatedPosts = this.posts.filter(post => post.id !==postId);
            this.posts = updatedPosts;
            this.postsUpdated.next([...this.posts]);

        })
    }
}