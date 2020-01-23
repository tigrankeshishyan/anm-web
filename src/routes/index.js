import News from 'pages/News';
import Terms from 'pages/Terms';
import HomePage from 'pages/Home';
import AboutUs from 'pages/AboutUs';
import NotFound from 'pages/NotFound';
import Musicians from 'pages/Musicians';
import ContactUs from 'pages/ContactUs';
import UserProfile from 'pages/UserProfile';
import MusicSheetScores from 'pages/Scores';

import NewsDetails from 'templates/NewsDetails';
import ScoreDetails from 'templates/ScoreDetails';
import MusicianDetails from 'templates/MusicianDetails';

import ResetPassword from 'Auth/ResetPassword/Component';
import AuthFormWrapper from 'Auth/AuthFormWrapper';

export default [
  {
    path: '/',
    key: 'home',
    title: 'home',
    component: HomePage,
  },
  {
    key: 'home',
    path: '/:locale/home',
    title: 'home',
    component: HomePage,
  },
  {
    key: 'news',
    isMain: true,
    path: '/:locale/news',
    title: 'news',
    component: News,
    translationKey: 'news',
  },
  {
    title: 'news/:path/:articleId',
    isMain: true,
    path: '/:locale/news',
    key: 'news',
    component: NewsDetails,
    translationKey: 'news',
  },
  {
    title: 'Music Sheet Scores',
    isMain: true,
    key: 'scores',
    path: '/:locale/music-sheet-scores',
    component: MusicSheetScores,
    translationKey: 'scores.title',
    pageDescriptionTranslationKey: 'scores.description',
  },
  {
    key: 'score-details',
    title: 'Music Sheet Score Details',
    path: '/:locale/music-sheet-scores/:path/:id',
    component: ScoreDetails,
  },
  {
    isMain: true,
    key: 'musicians',
    title: 'musicians',
    component: Musicians,
    path: ':locale/musicians',
    translationKey: 'musicians',
  },
  {
    key: 'musician-details',
    title: 'Musician Details',
    component: MusicianDetails,
    path: ':locale/musicians/:path/:id',
  },
  {
    key: 'aboutUs',
    title: 'About Us',
    component: AboutUs,
    path: '/:locale/about-us',
    translationKey: 'aboutUs',
    pageDescriptionTranslationKey: 'aboutUs.info',
  },
  {
    isMain: true,
    key: 'contactUs',
    title: 'Contact Us',
    component: ContactUs,
    path: '/:locale/contact-us',
    translationKey: 'contactUs',
  },
  {
    key: 'terms',
    title: 'terms',
    component: Terms,
    path: '/:locale/terms',
    translationKey: 'termsAndPrivacyPolicy',
  },
  {
    key: 'profile',
    title: 'User Profile',
    component: UserProfile,
    translationKey: 'profile',
    path: '/:locale/user-profile',
  },
  {
    key: 'signIn',
    title: 'Sign In',
    component: AuthFormWrapper,
    path: '/:locale/auth/sign-in',
  },
  {
    key: 'signUp',
    title: 'Sign Up',
    component: AuthFormWrapper,
    path: '/:locale/auth/sign-up',
  },
  {
    key: 'resetPassword',
    title: 'Reset Password',
    component: ResetPassword,
    path: '/:locale/reset-password/:token',
  },
  {
    component: NotFound,
  },
];
