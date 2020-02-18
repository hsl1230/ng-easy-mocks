import { TitleService } from './title.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title: string;

  constructor(private titleService: TitleService) {
  }

  ngOnInit(): void {
    this.title = this.titleService.genTitle();
  }

}
