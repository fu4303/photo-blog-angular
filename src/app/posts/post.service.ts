import { Post } from './post.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class PostService {

    postListChangedEvent = new Subject<Post[]>();
    posts: Post[] = [];
    maxPostId: number;

    constructor(private http: HttpClient) {
        this.maxPostId = this.getMaxId();
    }

    getMaxId(): number {

        let maxId = 0;

        for (let post of this.posts) {
            const currentId = Number(post.id);
            if (currentId > maxId) {
                maxId = currentId
            }
        }
        return maxId;
    }

    getPost(id: string): Post {
        return this.posts.find((post) => post.id === id);
    }

    getPosts() {
        this.http
        .get('http://localhost:3000/posts')
        .subscribe(
            (posts: Post[]) => {
                this.posts = posts;
                this.maxPostId = this.getMaxId();
                this.postListChangedEvent.next(this.posts.slice());
            },
            (error: any) => {
                console.log(error);
            }
        );
    }

    deletePost(post: Post) {

        if (!post) {
          return;
        }
    
        const pos = this.posts.findIndex(d => d.id === post.id);
    
        if (pos < 0) {
          return;
        }
    
        // delete from database
        this.http.delete('http://localhost:3000/posts/' + post.id)
          .subscribe(
            (response: Response) => {
              this.posts.splice(pos, 1);
              this.storePosts();
            }
          );
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
          .subscribe(
            (responseData) => {
              // add new post to posts
              this.posts.push(responseData.post);
              this.storePosts();
            }
          );
      }

      updatePost(originalPost: Post, newPost: Post) {
        if (!originalPost || !newPost) {
          return;
        }
    
        const pos = this.posts.findIndex(d => d.id === originalPost.id);
    
        if (pos < 0) {
          return;
        }
    
        // set the id of the new Post to the id of the old Post
        newPost.id = originalPost.id;
    
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
    
        // update database
        this.http.put('http://localhost:3000/posts/' + originalPost.id,
        newPost, { headers: headers })
          .subscribe(
            (response: Response) => {
              this.posts[pos] = newPost;
              this.storePosts();
            }
          );
      }

    storePosts() {
        let posts = JSON.stringify(this.posts);
        const headers = new HttpHeaders({'Content-Type': 'application/json'});
        this.http
        .put('https://cmsproject-640ac.firebaseio.com/documents.json',
            posts,
            { headers: headers })
        .subscribe(
            () => {
                this.postListChangedEvent.next(this.posts.slice());
            }
        );
    }

}