export * from './sectionRequests';
export * from './musicianTypes';
export const googleRecaptchaKeyV2 = '6LcvvLkUAAAAAL96hOhUh2KeqgpGQOEGuPyK5W5L';

const defaultTitle = 'Armenian National music';
const defaultDescription = 'Online platform which gives our users the possibility to listen, share and get more insight in Armenian music is sorted by epoch and genre.';
const keywords = 'Armenian Music,Հայ երաժշտություն,Armenia,Հայաստան,Music,Երաժշտություն,Khachatryan,Խաչատրյան,Mirzoyan,Միրզոյան,Babajanyan,Բաբաջանյան,Armenian,Հայկական,Yerevan,Երևան,News,Լուրեր,Kim,Կիմ,Kardashyan,Քարդաշյան,Kim Kardashyan,Քիմ Քարդաշյան,Media,Մեդիա,Violin,Ջութակ,Piano,Դաշնամուր,Duduk,Դուդուկ,Shvi,Շվի,Composer,Կոմպոզիտոր,Komitas,Կոմիտաս';

const {
  NODE_ENV,
  REACT_APP_HOST,
} = process.env;

const defaultImg = NODE_ENV === 'production'
  ? 'https://anmmedia.am/images/8d4f533b-e6b1-4e16-b6c0-4b849c817333'
  : 'https://stage.anmmedia.am/images/c8da273d-0ca4-438c-815e-acc46988104b';

export const siteMetadata = {
  keywords,
  image: defaultImg,
  url: REACT_APP_HOST,
  title: defaultTitle,
  author: 'ANM Media',
  siteUrl: REACT_APP_HOST,
  description: defaultDescription,
};
