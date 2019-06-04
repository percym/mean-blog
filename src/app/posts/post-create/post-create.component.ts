import { Component ,Output, OnInit } from '@angular/core';
import { post } from 'selenium-webdriver/http';
import {Post} from '../post.model'
import { NgForm, FormGroup, FormControl , Validators } from '@angular/forms';
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
    isLoading = false;
    form:FormGroup;
    imagePreview:any;

    
    constructor(public postsService: PostsService , public route :ActivatedRoute){

    }

    ngOnInit(): void {
        this.form = new FormGroup({
            'title':new FormControl(null,{
                validators:[Validators.required,Validators.minLength(3)]}),
             'content': new FormControl(null,Validators.required) ,
             'image': new FormControl(null,Validators.required)    
        });
        this.route.paramMap.subscribe((paramMap : ParamMap)=>{
                if(paramMap.has('postId')){
                    this.mode ='edit';
                    this.postId =paramMap.get('postId');
                    this.isLoading =true;
                    this.postsService.getPost(this.postId)
                    .subscribe(postData =>{
                        this.isLoading =false;
                        this.post = {
                            id:postData._id ,
                             title:postData.title,
                              content:postData.content
                            };
                       
                    this.form.setValue({
                        title:this.post.title,
                         content: this.post.content
                        }); 
                    });                                                                                                                                             
                }else{
                    this.mode ='create';
                    this.postId = null;
                }
        });

    }

    onSavePost(){
        if(this.form.invalid){
            return;
        }
        // const post :Post ={
        //     title:postForm.value.title,
        //      content:postForm.value.content
        // };
        this.isLoading =true;
        if(this.mode === 'create'){
            this.postsService.createPosts(
                this.form.value.title
                 ,this.form.value.content 
                 );
           
        }else{
            this.postsService.updatePost(
                this.postId,
                this.form.value.title ,
                this.form.value.content
                );
        }
        this.form.reset();
    }

    onImagePick(event:Event){
        const file = (event.target as HTMLInputElement).files[0];
        this.form.patchValue({image:file});
        this.form.get('image').updateValueAndValidity();
        const reader =  new FileReader();
        reader.onload =() =>{
            this.imagePreview = reader.result;
            console.log(this.imagePreview);
        };
        reader.readAsDataURL(file);

        // console.log(file);
        // console.log(this.form);


    }
}