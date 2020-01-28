import fetch from 'isomorphic-fetch'

const apiUrl = process.env.HOST

export const getOptions = (query, lang = 'hy') => ({
  method: 'POST',
  body: JSON.stringify({ query }),
  headers: {
    'Content-type': 'application/json',
    'Accept-Language': lang
  }
})

export const fetchGraphData = async (options, query) =>
  fetch(apiUrl, options || getOptions(query)).then(async res => res.json())

export const checkForErrors = (res, path) =>
  res && res.errors && console.error(`Error on, ${path}`, res.errors)
