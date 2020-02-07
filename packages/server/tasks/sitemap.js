import { languages, anmHost } from '../../config'
import { uploadSitemap } from '../utils/storage.util'
import { fetchGraphData, getOptions } from '../utils/graphql.util'

const staticRoutes = [
  '/:locale/news',
  '/:locale/musicians',
  '/:locale/music-sheet-scores',
  '/:locale/about-us',
  '/:locale/contact-us',
  '/:locale/terms',
  '/:locale/user-profile',
  '/:locale/auth/sign-in',
  '/:locale/auth/sign-up',
  '/:locale/home'
]

const getSitemapTemplate = content => {
  return (
    '<?xml version="1.0" encoding="UTF-8"?>' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' +
    `${content}` +
    '</urlset>'
  )
}

const getSitemapBlock = ({ url, lastMod, changeFreq = 'weekly' }) => {
  const lastModTag = lastMod
    ? `<lastmod>${new Date(lastMod).toISOString().split('T')[0]}</lastmod>`
    : ''

  return (
    '<url>' +
    `<loc>${url}</loc>` +
    `${lastModTag}` +
    `<changefreq>${changeFreq}</changefreq>` +
    '<priority>0.8</priority>' +
    '</url>'
  )
}

const articleQuery = `
  query Articles {
    items: articles(filter: { published: { equalTo: true } }) {
      nodes {
        id
        path
        updatedAt
      }
    }
  }
`

const musiciansQuery = `
  query Musicians {
    items: musicians(filter: { published: { equalTo: true } }) {
      nodes {
        id
        path
        updatedAt
      }
    }
  }
`

const scoresQuery = `
  query Scores {
    items: scores(filter: { published: { equalTo: true } }) {
      nodes {
        id
        path
        updatedAt
      }
    }
  }
`

const queryMap = {
  news: articleQuery,
  musicians: musiciansQuery,
  scores: scoresQuery
}

const pathMap = {
  news: 'news',
  musicians: 'musician',
  scores: 'music-sheet-score'
}

function sitemapIndex (suffix) {
  const indexContent = languages.reduce((langContent, lang) => {
    const routesContent = staticRoutes.reduce((routesContent, route) => {
      const isTheReason = route.endsWith(suffix)
      const routeContent = getSitemapBlock({
        url: `${anmHost}${route.replace(':locale', lang)}`,
        lastMod: isTheReason ? new Date() : null
      })
      return routesContent + routeContent
    }, '')
    return langContent + routesContent
  }, '')

  return getSitemapTemplate(indexContent)
}

async function generateForSuffix (suffix) {
  let langContent = ''

  for (const lang of languages) {
    const query = queryMap[suffix]
    const response = await fetchGraphData(getOptions(query, lang))

    langContent += response.data.items.nodes.reduce(function (
      nodesContent,
      node
    ) {
      const url = `${anmHost}/${lang}/${pathMap[suffix]}/${node.path}/${node.id}`

      return nodesContent + getSitemapBlock({ url, lastMod: node.updateAt })
    },
    '')
  }

  return getSitemapTemplate(langContent)
}

export async function generateSitemap (payload, helpers) {
  const { suffix } = payload

  const index = sitemapIndex(suffix)

  await uploadSitemap(index, 'index')

  const specificSitemap = await generateForSuffix(suffix)

  await uploadSitemap(specificSitemap, suffix)
}
