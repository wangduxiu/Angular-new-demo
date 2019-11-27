import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewsComponent } from './components/news/news.component';
import { ProductComponent } from './components/product/product.component';
import { NewstypeComponent } from './components/news/newstype/newstype.component';
import { NewslistComponent } from './components/news/newslist/newslist.component';
import { ProducttypeComponent } from './components/product/producttype/producttype.component';
import { ProductlistComponent } from './components/product/productlist/productlist.component';


const routes: Routes = [
  {
    path:'product',component:ProductComponent,
    children:[
      {path:'producttype',component:ProducttypeComponent},
      {path:'productlist',component:ProductlistComponent},
      {path:'**',redirectTo:'producttype'}
    ]
  },
  {
    path:'news',component:NewsComponent,
    children:[
      {path:'newstype',component:NewstypeComponent},
      {path:'newslist',component:NewslistComponent},
      {path:'**',redirectTo:'newstype'}
    ]
  }, 
  {
    path:'**',redirectTo:'news'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
