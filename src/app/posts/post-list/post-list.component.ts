import { Component , Input , OnInit, OnDestroy} from '@angular/core';
import {Post} from '../post.model'
import { PostsService } from '../posts.service';
import {Subscription} from 'rxjs';
import { PageEvent } from '@angular/material';

@Component({
    selector:'app-post-list',
    templateUrl:'./post-list.component.html',
    styleUrls:['./post-list.component.css']
})
export class PostListComponent implements OnInit ,OnDestroy{

    posts :Post[] = [];
    private postsSub:Subscription;
    isLoading =false;
    totalPosts = 10;
    postsPerPage =2;
    currentPage = 1;
    pageSizeOptions=[1 , 2, 5 ,10]
    constructor(public postsService:PostsService){}
    ngOnInit(): void {
        this.isLoading =true;
          this.postsService.getPosts(this.postsPerPage,1);
        this.postsSub = this.postsService.getPostsUpdatedListener()
        .subscribe((posts:Post[])=>{
            this.isLoading =false;
             this.posts = posts;   
        });
    }event

    onDelete(id :string){
        this.postsService.deletePost(id);
    }

    onPageChanged(pageData:PageEvent){
        console.log(pageData);
        this.currentPage = pageData.pageIndex + 1;
        this.postsPerPage = pageData.pageSize;
        this.postsService.getPosts(this.postsPerPage,this.currentPage); 

    }
    ngOnDestroy(): void {
        this.postsSub.unsubscribe();
    }

}

    // posts=[
    //     {title:'First Post', content:'this is the first post content'},
    //     {title:'Second Post', content:'this is the second post content'},
    //     {title:'third Post', content:'this is the third post content'},
    // ];