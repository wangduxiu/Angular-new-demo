import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NewsComponent } from './components/news/news.component';
import { ProductComponent } from './components/product/product.component';
import { NewstypeComponent } from './components/news/newstype/newstype.component';
import { NewslistComponent } from './components/news/newslist/newslist.component';
import { ProducttypeComponent } from './components/product/producttype/producttype.component';
import { ProductlistComponent } from './components/product/productlist/productlist.component';

@NgModule({
  declarations: [
    AppComponent,
    NewsComponent,
    ProductComponent,
    NewstypeComponent,
    NewslistComponent,
    ProducttypeComponent,
    ProductlistComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
