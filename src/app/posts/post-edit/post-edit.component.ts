import { Component, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../post.service';
import { Post } from '../post.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {
  @ViewChild('f') postForm: NgForm;
  originalPost: Post;
  post: Post;
  editMode: boolean = false;
  subscription: Subscription;
  id: string;

  constructor(private postService: PostService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        if (!this.id) { 
          this.editMode = false;
          return;
        }
        this.originalPost = this.postService.getPost(this.id);

        if (!this.originalPost) {
          return;
        }
        this.editMode = true;
        this.post = JSON.parse(JSON.stringify(this.originalPost));
      });
  }

  onSubmit(form: NgForm) {
    const value = form.value;
    const newPost = new Post('', value.title, value.date, value.imageUrl, value.content);
    if (this.editMode) {
      this.postService.updatePost(this.originalPost, newPost)
    } else {
      this.postService.addPost(newPost)
    }
    this.onCancel();

  }

  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
