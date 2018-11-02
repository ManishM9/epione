import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { ImageService } from './services/image.service';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './components/home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [ImageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
