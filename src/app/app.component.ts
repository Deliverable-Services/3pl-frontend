import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANG, I18N_LANGUAGES } from '../config/language-config';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'da-app',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  currentLang = localStorage.getItem('lang') || window.navigator.language.toLowerCase() || DEFAULT_LANG;
  public pageTitle: string | undefined;
  constructor(private translate: TranslateService, private titleService: Title, private route: ActivatedRoute) {
    this.translate.addLangs(I18N_LANGUAGES);
    translate.setDefaultLang(DEFAULT_LANG);
    translate.use(this.currentLang);
    this.titleService.setTitle(this.route.snapshot.data['title']);
  }
}
