import { Component , Input , OnInit, OnDestroy} from '@angular/core';
import {Post} from '../post.model'
import { PostsService } from '../posts.service';
import {Subscription} from 'rxjs';
import { PageEvent } from '@angular/material';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
    selector:'app-post-list',
    templateUrl:'./post-list.component.html',
    styleUrls:['./post-list.component.css']
})
export class PostListComponent implements OnInit ,OnDestroy{

    posts :Post[] = [];
    private postsSub:Subscription;
    isLoading =false;
    totalPosts = 0;
    postsPerPage =2;
    currentPage = 1;
    pageSizeOptions=[1 , 2, 5 ,10]
    userIsAuthenticated =false;
    userId:string;
    private authStatusSub : Subscription;
    constructor(public postsService:PostsService , private authService :AuthService){}

    ngOnInit(): void {
        this.isLoading =true;
          this.postsService.getPosts(this.postsPerPage,1);
          this.userId = this.authService.getUserId();
        this.postsSub = this.postsService.getPostsUpdatedListener()
        .subscribe((postsData:{posts:Post[], postCount:number})=>{
            this.isLoading =false;
             this.posts = postsData.posts;   
             this.totalPosts = postsData.postCount;
             this.userId = this.authService.getUserId();
        });
        this.userIsAuthenticated = this.authService.getIsAuthenticated();
       this.authStatusSub =  this.authService.getAuthStatusListener()
       .subscribe(isAuthenticated => {
           this.userIsAuthenticated = isAuthenticated;
       });
    }

    onDelete(id :string){
        this.postsService.deletePost(id).subscribe(()=>{
            this.postsService.getPosts(this.postsPerPage, this.currentPage)
        });
    }

    onPageChanged(pageData:PageEvent){
        console.log(pageData);
        this.isLoading = true;
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage,this.currentPage); 

    }
    ngOnDestroy(): void {
        this.postsSub.unsubscribe();
        this.authStatusSub.unsubscribe();
    }

}

    // posts=[
    //     {title:'First Post', content:'this is the first post content'},
    //     {title:'Second Post', content:'this is the second post content'},
    //     {title:'third Post', content:'this is the third post content'},
    // ];