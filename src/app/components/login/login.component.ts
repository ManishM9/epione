import { Component, OnInit } from '@angular/core';

import { ImageService } from '../../services/image.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  username: string = "";
  password: string = "";

  constructor(private imageService: ImageService, private router: Router) { }

  ngOnInit() {
  }

  submit(){
    console.log(this.username);
    console.log(this.password);
    this.imageService.login({ username: this.username, password: this.password }).subscribe(data => {
      console.log(data);
      if(data){
        this.router.navigate(['/']);
      }
    });
  }

}
