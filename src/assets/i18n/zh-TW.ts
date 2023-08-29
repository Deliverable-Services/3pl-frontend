import pages from './zh-TW/page';
import form from './zh-TW/form';
import abnormal from './zh-TW/abnormal';
import personalize from './zh-TW/personalize';
import list from './zh-TW/list';
import dashboard from './zh-TW/dashboard';
import login from './zh-TW/login';
import register from './zh-TW/register';
import sideSetting from './zh-TW/side-setting';
import header from './zh-TW/header';
import footer from './zh-TW/footer';
import authGuard from './zh-TW/auth-guard';
import notice from './zh-TW/notice';

export default {
  ...pages,
  ...form,
  ...list,
  ...abnormal,
  ...personalize,
  ...dashboard,
  ...login,
  ...register,
  ...sideSetting,
  ...header,
  ...footer,
  ...authGuard,
  ...notice,
};
