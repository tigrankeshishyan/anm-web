import { addLocaleKey } from 'localization/helpers';
import {
  SCORES,
  CONTACT_US,
  USER_PROFILE,
  SCORE_DETAIL,
} from 'localization/constants';

import newsLocalesHy from '../News/locales/hy';
import contactUsLocalesHy from '../ContactUs/locales/hy';
import scoreDetailLocalesHy from '../Scores/ScoreDetails/locales/hy';
import userProfileLocalesHy from '../UserProfile/locales/hy';
import musicSheetScoresLocalesHy from '../Scores/locales/hy';

export default {
  ...newsLocalesHy,
  ...addLocaleKey(CONTACT_US, contactUsLocalesHy),
  ...addLocaleKey(SCORES, musicSheetScoresLocalesHy),
  ...addLocaleKey(USER_PROFILE, userProfileLocalesHy),
  ...addLocaleKey(SCORE_DETAIL, scoreDetailLocalesHy),
};
