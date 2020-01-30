import fetch from 'isomorphic-fetch'

const apiUrl = `${process.env.HOST}/graphql`

export const getOptions = (query, lang = 'hy') => ({
  method: 'POST',
  body: JSON.stringify({ query }),
  headers: {
    'Content-type': 'application/json',
    'Accept-Language': lang
  }
})

export const fetchGraphData = async (options, query) => {
  const response = await fetch(apiUrl, options || getOptions(query))
  if (response.status >= 200 && response.status < 300) {
    return response.json()
  } else {
    throw await response.text()
  }
}

export const checkForErrors = (res, path) =>
  res && res.errors && console.error(`Error on, ${path}`, res.errors)
