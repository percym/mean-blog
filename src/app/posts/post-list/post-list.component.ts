import { Component , Input , OnInit, OnDestroy} from '@angular/core';
import {Post} from '../post.model'
import { PostsService } from '../posts.service';
import {Subscription} from 'rxjs';

@Component({
    selector:'app-post-list',
    templateUrl:'./post-list.component.html',
    styleUrls:['./post-list.component.css']
})
export class PostListComponent implements OnInit ,OnDestroy{

    posts :Post[] = [];
    private postsSub:Subscription;
 
    constructor(public postsService:PostsService){}
    ngOnInit(): void {
          this.postsService.getPosts();
        this.postsSub = this.postsService.getPostsUpdatedListener()
        .subscribe((posts:Post[])=>{
             this.posts = posts;   
        });
    }

    onDelete(id :string){
        this.postsService.deletePost(id);
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