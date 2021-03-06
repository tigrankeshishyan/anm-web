import { addLocaleKey } from 'localization/helpers';
import {
  SCORES,
  CONTACT_US,
  USER_PROFILE,
  SCORE_DETAIL,
} from 'localization/constants';


import newsLocalesEn from '../News/locales/en';
import contactUsLocalesEn from '../ContactUs/locales/en';
import userProfileLocalesEn from '../UserProfile/locales/en';
import musicSheetScoresLocalesEn from '../Scores/locales/en';
import scoreDetailLocalesEn from '../Scores/ScoreDetails/locales/en';

export default {
  ...newsLocalesEn,
  ...addLocaleKey(CONTACT_US, contactUsLocalesEn),
  ...addLocaleKey(SCORES, musicSheetScoresLocalesEn),
  ...addLocaleKey(USER_PROFILE, userProfileLocalesEn),
  ...addLocaleKey(SCORE_DETAIL, scoreDetailLocalesEn),
};
