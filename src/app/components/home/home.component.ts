import { Component, OnInit } from '@angular/core';

import { ImageService } from '../../services/image.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private imageService: ImageService) { }

  ngOnInit() {
    this.getImageLen();
  }

  getImageLen() {
    this.imageService.getImagesLength().subscribe(data => {
      console.log(data);
    });
  }

}
