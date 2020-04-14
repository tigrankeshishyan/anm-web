import express from 'express';

import auth from './auth/auth.api';
import health from './health';
import images from './images/images.api';
import robots from './robots';
import scores from './scores/scores.api';
import sitemap from './sitemap/sitemap.api';

const router = express.Router();

export default router
  .use('/auth', auth)
  .use('/health', health)
  .use('/images', images)
  .use('/scores', scores)
  .use('/sitemap', sitemap)
  .use('/robots.txt', robots);
