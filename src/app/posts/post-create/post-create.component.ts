import { Component ,Output } from '@angular/core';
import { post } from 'selenium-webdriver/http';
import {Post} from '../post.model'
import { NgForm } from '@angular/forms';
import {PostsService} from '../posts.service';

import { from } from 'rxjs';
@Component({
    selector:'app-post-create',
    templateUrl:'./post-create.component.html',
    styleUrls:['./post-create.component.css']
})
export class PostCreateComponent{
    enteredTitle= '';
    enteredContent= '';

    constructor(public postsService: PostsService){

    }
    onAddPost(postForm:NgForm){
        if(postForm.invalid){
            return;
        }
        // const post :Post ={
        //     title:postForm.value.title,
        //      content:postForm.value.content
        // };
        this.postsService.createPosts(postForm.value.title ,postForm.value.content );
    }
}