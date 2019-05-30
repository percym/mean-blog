import { Component , EventEmitter , Output } from '@angular/core';
import { post } from 'selenium-webdriver/http';
import {Post} from '../post.model'
import { NgForm } from '@angular/forms';
import { formArrayNameProvider } from '@angular/forms/src/directives/reactive_directives/form_group_name';

@Component({
    selector:'app-post-create',
    templateUrl:'./post-create.component.html',
    styleUrls:['./post-create.component.css']
})
export class PostCreateComponent{
    enteredTitle= '';
    enteredContent= '';
    @Output() postCreated = new EventEmitter<Post>();

    onAddPost(postForm:NgForm){
        if(postForm.invalid){
            return;
        }
        const post :Post ={
            title:postForm.value.title,
             content:postForm.value.content};
        this.postCreated.emit(post);
    }
}