import { getCurrentLang } from 'localization/helpers';
import formatNames from 'localization/calendar';
import Moment from 'moment';

const lang = getCurrentLang();

Moment.updateLocale(lang, formatNames[lang]);

export default Moment;

export const generateDateKeyString = () => String(new Date().valueOf());
