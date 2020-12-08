import { Component, OnInit } from '@angular/core';
import { Post } from '../post.model';
import { PostService } from '../post.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post: Post;
  id: string;

  constructor(private postService: PostService,
              private route: ActivatedRoute,
              private router: Router,) { }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = params['id'];
        this.post = this.postService.getPost(this.id);
      }
    )
  }

  onDelete() {
    this.postService.deletePost(this.post);
    this.router.navigate(['/posts']);
  }

}
