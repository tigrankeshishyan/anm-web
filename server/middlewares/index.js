import path from 'path'
import isBot from 'isbot'
import dirname from 'es-dirname'

import { appDefaultData, appAboutUsData, appContactUsData } from '../constants'
import { getSingleNewsData } from './news'
import { getSingleMusicianData } from './musicians'
import { getSingleScoreData } from './scores'

const getUrl = req => process.env.HOST + req.originalUrl
const defaultLocale = 'hy'

export const fetchData = async req => {
  const { id, locale = defaultLocale } = req.params
  const url = getUrl(req)

  if (url.includes('about-us')) return appAboutUsData[locale]
  if (url.includes('contact-us')) return appContactUsData[locale]
  if (url.includes('/news/')) return getSingleNewsData(id, locale, url)
  if (url.includes('/musician/')) return getSingleMusicianData(id, locale, url)
  if (url.includes('/score/')) return getSingleScoreData(id, locale, url)

  return { url }
}

export default async (req, res, next) => {
  try {
    // Detect if the request comes from browser or from crawler, spider, etc.
    if (!isBot(req.headers['user-agent'])) {
      res.sendFile(path.resolve(dirname(), '../../client/build/index.html'))
      return
    }

    const { locale = defaultLocale } = req.params
    const data = await fetchData(req)
    const params = {
      ...appDefaultData[locale],
      ...data,
      content: data.content || data.description
    }

    res.render('main', params)
  } catch (err) {
    next(err)
  }
}
