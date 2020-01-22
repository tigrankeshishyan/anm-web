import { addLocaleKey } from 'locales/helpers';
import { SCORE_DETAIL } from 'locales/constants';
import scoreDetailLocales from './ScoreDetails/locales';

export default {
  en: {
    ...addLocaleKey(SCORE_DETAIL, scoreDetailLocales.en),
  },
  hy: {
    ...addLocaleKey(SCORE_DETAIL, scoreDetailLocales.hy),
  },
};
