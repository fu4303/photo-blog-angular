import { Component, OnInit } from '@angular/core';
import { Post } from './post.model';
import { PostService } from './post.service'

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
