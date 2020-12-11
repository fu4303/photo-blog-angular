import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PostsComponent } from './posts/posts.component';
import { PostEditComponent } from './posts/post-edit/post-edit.component';
import { PostDetailComponent } from './posts/post-detail/post-detail.component';
import { AboutPageComponent } from './about/about-page/about-page.component';



const appRoutes: Routes = [
    { path: '', redirectTo: '/posts', pathMatch: 'full' },

    { path: 'posts', component: PostsComponent, children: 
        [
            { path: 'new', component: PostEditComponent },
            { path: ':id', component: PostDetailComponent },
            { path: ':id/edit', component: PostEditComponent },
        ] 
    },

    { path: 'about', component: AboutPageComponent },
]

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule { }