import { lazy } from 'react';
import AsyncComponentLoader from 'components/AsyncComponentLoader';

export default [
  {
    key: 'news',
    exact: true,
    isMain: true,
    isStatic: true,
    path: '/:locale/news',
    linkPath: '/news',
    title: 'news',
    component: AsyncComponentLoader(lazy( () => import('pages/News/index.js'))),
    translationKey: 'news',
  },
  {
    key: 'news',
    exact: true,
    title: 'News Details',
    path: '/:locale/news/:path/:articleId?',
    component: AsyncComponentLoader(lazy( () => import('pages/News/NewsDetails/index.js'))),
  },
  {
    exact: true,
    isMain: true,
    isStatic: true,
    key: 'musicians',
    title: 'musicians',
    linkPath: '/musicians',
    path: '/:locale/musicians',
    translationKey: 'musicians',
    component: AsyncComponentLoader(lazy( () => import('pages/Musicians/index.js'))),
  },
  {
    key: 'musician-details',
    title: 'Musician Details',
    path: '/:locale/musician/:path/:musicianId',
    component: AsyncComponentLoader(lazy( () => import('pages/Musicians/MusicianDetails/index.js'))),
  },
  {
    isMain: true,
    key: 'scores',
    isStatic: true,
    title: 'Music Sheet Scores',
    path: '/:locale/music-sheet-scores',
    linkPath: '/music-sheet-scores',
    component: AsyncComponentLoader(lazy( () => import('pages/Scores/index.js'))),
    translationKey: 'scores.title',
    pageDescriptionTranslationKey: 'scores.description',
  },
  {
    key: 'score-details',
    title: 'Music Sheet Score Details',
    path: '/:locale/music-sheet-score/:path/:scoreId',
    component: AsyncComponentLoader(lazy( () => import('pages/Scores/ScoreDetails/index.js'))),
  },
  {
    isStatic: true,
    key: 'aboutUs',
    title: 'About Us',
    path: '/:locale/about-us',
    translationKey: 'aboutUs',
    pageDescriptionTranslationKey: 'aboutUs.info',
    component: AsyncComponentLoader(lazy( () => import('pages/AboutUs/index.js'))),
  },
  {
    exact: true,
    isMain: true,
    isStatic: true,
    key: 'contactUs',
    title: 'Contact Us',
    linkPath: '/contact-us',
    path: '/:locale/contact-us',
    translationKey: 'contactUs',
    component: AsyncComponentLoader(lazy( () => import('pages/ContactUs/index.js'))),
  },
  {
    exact: true,
    key: 'terms',
    isStatic: true,
    title: 'terms',
    path: '/:locale/terms',
    translationKey: 'termsAndPrivacyPolicy',
    component: AsyncComponentLoader(lazy( () => import('pages/Terms/index.js'))),
  },
  {
    exact: true,
    isStatic: true,
    key: 'profile',
    title: 'User Profile',
    translationKey: 'profile',
    path: '/:locale/user-profile',
    component: AsyncComponentLoader(lazy( () => import('pages/UserProfile/index.js'))),
  },
  {
    isStatic: true,
    key: 'signIn',
    title: 'Sign In',
    path: '/:locale/auth/sign-in',
    component: AsyncComponentLoader(lazy( () => import('Auth/AuthFormWrapper/index.js'))),
  },
  {
    isStatic: true,
    key: 'signUp',
    title: 'Sign Up',
    path: '/:locale/auth/sign-up',
    component: AsyncComponentLoader(lazy( () => import('Auth/AuthFormWrapper/index.js'))),
  },
  {
    key: 'resetPassword',
    title: 'Reset Password',
    component: AsyncComponentLoader(lazy( () => import('Auth/ResetPassword/index.js'))),
    path: '/:locale/reset-password/:token',
  },
  {
    path: '/',
    linkPath: '/',
    key: 'home',
    title: 'home',
    component: AsyncComponentLoader(lazy( () => import('pages/Home/index.js'))),
  },
  {
    key: 'home',
    title: 'home',
    isStatic: true,
    linkPath: '/home',
    path: '/:locale/home',
    component: AsyncComponentLoader(lazy( () => import('pages/Home/index.js'))),
  },
  {
    component: AsyncComponentLoader(lazy( () => import('pages/NotFound/index.js'))),
  },
];
