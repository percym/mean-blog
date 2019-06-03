import { Component ,Output, OnInit } from '@angular/core';
import { post } from 'selenium-webdriver/http';
import {Post} from '../post.model'
import { NgForm } from '@angular/forms';
import {PostsService} from '../posts.service';

import { from } from 'rxjs';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';
import { ActivatedRoute, ParamMap } from '@angular/router';
@Component({
    selector:'app-post-create',
    templateUrl:'./post-create.component.html',
    styleUrls:['./post-create.component.css']
})
export class PostCreateComponent  implements OnInit{
    
    enteredTitle= '';
    enteredContent= '';
    private mode = 'create';
    private postId :string;
    post :Post;

    
    constructor(public postsService: PostsService , public route :ActivatedRoute){

    }

    ngOnInit(): void {
        this.route.paramMap.subscribe((paramMap : ParamMap)=>{
                if(paramMap.has('postId')){
                    this.mode ='edit';
                    this.postId =paramMap.get('postId');
                this.post = this.postsService.getPost(this.postId);
                }else{
                    this.mode ='create';
                    this.postId = null;
                }
        });

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
        postForm.reset();
    }
}