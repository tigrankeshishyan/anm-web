import path from 'path'
import isBot from 'isbot'
import dirname from 'es-dirname'

import {
  appDefaultData,
  appAboutUsData,
  appContactUsData,
} from '../constants'
import { getSingleNewsData } from './news'
import { getSingleMusicianData } from './musicians'
import { getSingleScoreData } from './scores'

const getUrl = req => process.env.HOST + req.originalUrl
const defaultLocale = 'hy';

export const getFetchFn = req => {
  const { originalUrl } = req
  const { id, locale = defaultLocale } = req.params

  if (!id) {
    return undefined
  }

  if (originalUrl.includes('about-us')) {
    return new Promise(resolve => resolve(appAboutUsData[locale]))
  }

  if (originalUrl.includes('contact-us')) {
    return new Promise(resolve => resolve(appContactUsData[locale]))
  }

  if (originalUrl.includes('news')) {
    return getSingleNewsData
  }

  if (originalUrl.includes('musician')) {
    return getSingleMusicianData
  }

  if (originalUrl.includes('score')) {
    return getSingleScoreData
  }
}

export default (req, res) => {
  // Detect if the request comes from browser or from crawler, spider, etc.
  if (!isBot(req.headers['user-agent'])) {
    res.sendFile(path.resolve(dirname(), '../../client/build/index.html'))
    return
  }

  const { locale = defaultLocale } = req.params

  const fetchDataFn = getFetchFn(req)
  const url = getUrl(req)
  if (!fetchDataFn) {
    res.render('main', { ...appDefaultData[locale], url })
    return
  }

  fetchDataFn(req.params.id, req.params.locale, url).then(data => {
    const { title, content, imageUrl, description } = data

    res.render('main', {
      ...appDefaultData[locale],
      url,
      title,
      imageUrl,
      description,
      content: content || description,
    })
  })
}
