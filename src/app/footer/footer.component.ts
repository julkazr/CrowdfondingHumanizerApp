import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  constructor(private _translate: TranslateService) { }

  useLanguage(language: string) {
    this._translate.use(language);
    localStorage.setItem('language', language);
  }

  ngOnInit() {
    const userLanguage = localStorage.getItem('language');
    if (userLanguage) {
      this._translate.use(userLanguage);
    }
  }

}
