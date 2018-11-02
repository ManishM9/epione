import { Component, OnInit } from '@angular/core';

import { ImageService } from '../../services/image.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  n: number = 0;
  urls: Array<String> = null;

  constructor(private imageService: ImageService, private router: Router) { }

  ngOnInit() {
    this.imageService.getLogin().subscribe(data => {
      if(!data){
        this.router.navigate(['/login']);
      }
    });
    this.getImageLen();
  }

  getImageLen() {
    this.imageService.getImagesLength().subscribe(data => {
      console.log(data);
      this.n = data.len;
      if(this.n>0){
        this.makeurls();
      }
    });
  }

  makeurls() {
    this.urls = [];
    for(var i=1;i<=this.n;i++){
      this.urls.push('image'+String(i)+".png");
    }
  }

}
