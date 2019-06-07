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
    private postsUpdated = new Subject<{posts:Post[],postCount:number}>();

    constructor(private http:HttpClient , private router:Router){

    }
    getPosts(postsPerPage:number , currentPage:number){
        const queryParams =`?pageSize=${postsPerPage}&page=${currentPage}`;
        this.http.get<{message:string, posts: any, maxPosts:number}>('http://localhost:3000/api/posts'+queryParams)
        .pipe(map((postData)=>{
            return { posts:postData.posts.map(post=> {
                return {
                title : post.title,
                content : post.content,
                id : post._id, 
                imagePath:post.imagePath
                }
            }),maxPosts:postData.maxPosts};
        }))
        .subscribe(transformedPostsData=>{
            console.log('____________________transData');
            console.log(transformedPostsData);
            this.posts = transformedPostsData.posts;
            this.postsUpdated.next({posts:[...this.posts], postCount:transformedPostsData.maxPosts});
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
            // const post : Post ={
            //     id:resData.post.id,
            //     title:title ,
            //     content:content,
            //     imagePath:resData.post.imagePath
            //     }; 
            // this.posts.push(post);
            // this.postsUpdated.next([...this.posts]);
            this.router.navigate(["/"]);
            });
    }

    updatePost(id:string , title :string ,content:string){
        const post ={id:id ,title:title , content:content, imagePath:null};
        this.http.put('http://localhost:3000/api/posts/'+post.id,post).
        subscribe((resp)=>{
        //    const updatePosts =[...this.posts];
        //    const oldPostIndex = updatePosts.findIndex(p => p.id === post.id);
        //    updatePosts[oldPostIndex] = post;
        //    this.posts = updatePosts;
        //    this.postsUpdated.next([...this.posts]);
           this.router.navigate(["/"]);
        });
    }


    deletePost(postId:String ){
      return  this.http.delete('http://localhost:3000/api/posts/'+postId);
    }
}