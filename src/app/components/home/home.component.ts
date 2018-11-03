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
  avgsteps: Number = 0;
  avgbpm: Number = 0;
  breathrate: Number = 0;
  fit: Number = 0;

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

  getfit() {
    this.imageService.getfit().subscribe(data => {
      if(!data){
        this.avgsteps = data.avgsteps;
        this.avgbpm = data.avgbpm;
        this.breathrate = data.breathrate;
        this.fit = data.fit;
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
