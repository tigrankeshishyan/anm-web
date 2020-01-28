import path from 'path'
import isBot from 'isbot'
import dirname from 'es-dirname'

import { appDefaultData } from '../constants'
import { getSingleNewsData } from './news'
import { getSingleMusicianData } from './musicians'
import { getSingleScoreData } from './scores'

const getUrl = req => process.env.HOST + req.originalUrl

export const getFetchFn = req => {
  const { originalUrl } = req
  const { id } = req.params

  if (!id) {
    return undefined
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

  const fetchDataFn = getFetchFn(req)
  const url = getUrl(req)
  if (!fetchDataFn) {
    res.render('main', { ...appDefaultData, url })
    return
  }

  fetchDataFn(req.params.id, req.params.locale, url).then(data => {
    const { title, content, imageUrl, description } = data

    res.render('main', {
      ...appDefaultData,
      url,
      title,
      content,
      imageUrl,
      description
    })
  })
}
