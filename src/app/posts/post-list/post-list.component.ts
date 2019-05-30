import { Component , Input} from '@angular/core';
import {Post} from '../post.model'

@Component({
    selector:'app-post-list',
    templateUrl:'./post-list.component.html',
    styleUrls:['./post-list.component.css']
})
export class PostListComponent {
    // posts=[
    //     {title:'First Post', content:'this is the first post content'},
    //     {title:'Second Post', content:'this is the second post content'},
    //     {title:'third Post', content:'this is the third post content'},
    // ];
   @Input() posts :Post[] = [];
}