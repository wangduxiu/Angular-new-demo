import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { RequestService } from './services/request.service';

import { CreateComponent } from './create/create.component';
import { ReadComponent } from './read/read.component';
import { reducer } from './reducers/tutorial.reducer';

import { StoreModule } from '@ngrx/store';
import { DialogComponent } from './components/dialog/dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreateComponent,
    ReadComponent,
    DialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    StoreModule.forRoot({
      tutorial: reducer
    })
  ],
  providers: [RequestService],
  bootstrap: [AppComponent]
})
export class AppModule { }
