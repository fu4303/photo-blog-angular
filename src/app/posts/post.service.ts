import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class PostService {

    postListChangedEvent = new Subject<Post[]>();
    posts: Post[] = [];
    maxPostId: number;
    postsUpdated = new Subject<Post[]>();

    constructor(private http: HttpClient,
                private router: Router) {
        
    }

    getPosts(){
        this.http
          .get<{ message : string, posts : Post[]}>('http://localhost:3000/posts')
          .subscribe(
            (postData) => {
               this.posts = postData.posts;
               this.postListChangedEvent.next(this.posts.slice());
            },
            (error: any) => {
               console.log(error)
            });
    }

    getPost(id: string): Post {
        return this.posts.find((post) => post.id === id);
    }

    deletePost(postId: string) {
        this.http.delete('http://localhost:3000/posts/' + postId)
        .subscribe(() => {
          this.posts.splice(+postId, 1);
          this.storePosts();
          location.reload();
        });
      }

    addPost(post: Post) {
        if (!post) {
          return;
        }
    
        // make sure the id of the new Post is empty
        post.id = '';

        const headers = new HttpHeaders({'Content-Type': 'application/json'});

        // add to database
        this.http.post<{ message: string, post: Post }>('http://localhost:3000/posts',
          post,
          { headers: headers })
          .subscribe((postData) => {
              // add new post to posts
              this.posts.push(postData.post);
              this.postListChangedEvent.next(this.posts.slice());
              this.storePosts();
            }
          );
      }

      updatePost(originalPost: Post, newPost: Post) {
        if (!originalPost || !newPost) {
          return;
        }
    
        const pos = this.posts.findIndex(p => p.id === originalPost.id);
    
        if (pos < 0) {
          return;
        }
    
        // set the id of the new Post to the id of the old Post
        newPost.id = originalPost.id;
    
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        console.log("original id: " + originalPost.id);
        // update database
        this.http.put<{ message: string, post: Post }>('http://localhost:3000/posts/' + originalPost.id,
        newPost, { headers: headers })
          .subscribe(
            (postData) => {
              this.posts[pos] = newPost;
              this.storePosts();
            }
          );
      }

    storePosts() {
        let posts = JSON.stringify(this.posts);
        const headers = new HttpHeaders({'Content-Type': 'application/json'});

        this.http.put<{ message: string, post: Post }>('http://localhost:3000/posts',
            posts,
            { headers: headers })
        .subscribe(
            () => {
              this.postListChangedEvent.next(this.posts.slice());
              this.router.navigate(["/"]);
            }
        );
    }
}