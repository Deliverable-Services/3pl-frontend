import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANG, I18N_LANGUAGES } from '../config/language-config';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { JwtHandlerService } from './jwt-handler.service';
@Component({
  selector: 'da-app',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {

  currentLang = localStorage.getItem('lang') || window.navigator.language.toLowerCase() || DEFAULT_LANG;
  public pageTitle: string | undefined;
  constructor(private translate: TranslateService, private titleService: Title, private route: ActivatedRoute,
    private jwtHandlerService: JwtHandlerService) {
    this.translate.addLangs(I18N_LANGUAGES);
    translate.setDefaultLang(DEFAULT_LANG);
    translate.use(this.currentLang);
    this.titleService.setTitle(this.route.snapshot.data['title']);
  }
  ngOnInit() {
    this.jwtHandlerService.checkAndStoreJwtFromUrl();
  }

}
