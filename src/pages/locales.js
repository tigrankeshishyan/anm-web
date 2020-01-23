import { addLocaleKey } from 'locales/helpers';
import {
  SCORES,
  CONTACT_US,
  USER_PROFILE,
} from 'locales/constants';
import newsLocales from './News/locales';
import contactUsLocales from './ContactUs/locales';
import musicSheetScoresLocales from './Scores/locales';
import userProfileLocales from './UserProfile/locales';

export default {
  en: {
    ...newsLocales.en,
    ...addLocaleKey(CONTACT_US, contactUsLocales.en),
    ...addLocaleKey(SCORES, musicSheetScoresLocales.en),
    ...addLocaleKey(USER_PROFILE, userProfileLocales.en),
  },
  hy: {
    ...newsLocales.hy,
    ...addLocaleKey(CONTACT_US, contactUsLocales.hy),
    ...addLocaleKey(SCORES, musicSheetScoresLocales.hy),
    ...addLocaleKey(USER_PROFILE, userProfileLocales.hy),
  },
};
