import express from 'express';
import { anmHost } from '../config';

export default express.Router().get('/', (req, res, next) => {
  const content = `
User-agent: *

Sitemap: ${anmHost}/sitemap/index.xml
Sitemap: ${anmHost}/sitemap/news.xml
Sitemap: ${anmHost}/sitemap/musicians.xml
Sitemap: ${anmHost}/sitemap/scores.xml
  `.trim();

  res.contentType('text/plain').send(content);
});
