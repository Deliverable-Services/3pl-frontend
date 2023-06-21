import zhCN from '../assets/i18n/zh-CN';
import enUS from '../assets/i18n/en-US';
import zhTW from '../assets/i18n/zh-TW';

export const LANGUAGES = [
  {
    code: 'zh-cn',
    lang: '简体中文',
    prefix: 'CN',
  },
  {
    code: 'zh-tw',
    lang: '繁體中文',
    prefix: 'TW',
  },
  {
    code: 'en-us',
    lang: 'English',
    prefix: 'US',
  },
];

export const I18N_LANGUAGES = ['zh-cn', 'zh-tw', 'en-us'];
export const DEFAULT_LANG = 'zh-cn';

export const I18N = {
  'zh-cn': zhCN,
  'en-us': enUS,
  'zh-tw': zhTW
};
