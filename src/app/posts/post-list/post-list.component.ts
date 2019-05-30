import { Component , Input , OnInit} from '@angular/core';
import {Post} from '../post.model'
import { PostsService } from '../posts.service';

@Component({
    selector:'app-post-list',
    templateUrl:'./post-list.component.html',
    styleUrls:['./post-list.component.css']
})
export class PostListComponent implements OnInit {
    ngOnInit(): void {
        this.posts = this.postsService.getPosts();
    }


   @Input() posts :Post[] = [];

   constructor(public postsService:PostsService){}
}

    // posts=[
    //     {title:'First Post', content:'this is the first post content'},
    //     {title:'Second Post', content:'this is the second post content'},
    //     {title:'third Post', content:'this is the third post content'},
    // ];