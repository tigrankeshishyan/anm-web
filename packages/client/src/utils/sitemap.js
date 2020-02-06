import routes from "routes";
import { languages } from "localization/constants";
import fetch from "isomorphic-fetch";
import { gql } from "apollo-boost";

const host = process.env.REACT_APP_HOST;

const staticRoutes = routes.filter(route => route.isStatic);

export const getOptions = (query, lang = "hy") => ({
  method: "POST",
  body: JSON.stringify({ query }),
  headers: {
    "Content-type": "application/json",
    "Accept-Language": lang
  }
});

export const fetchGraphData = async options => {
  const response = await fetch(host + "/graphql", options);
  if (response.status >= 200 && response.status < 300) {
    return response.json();
  } else {
    throw await response.text();
  }
};

const getSitemapTemplate = content => {
  return `
      <?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${content}
      </urlset>
  `;
};

const getSitemapBlock = ({ url, lastMod, changefreq = "weekly" }) => {
  return `
    <url>
      <loc>${url}</loc>
      ${
        lastMod
          ? `<lastmod>${
              new Date(lastMod).toISOString().split("T")[0]
            }</lastmod>`
          : ""
      }
      <changefreq>${changefreq}</changefreq>
      <priority>0.8</priority>
    </url>
  `;
};

const articleQuery = gql`
  query Articles {
    articles (filter: {
    published: {
      equalTo: true,
    }
  }) {
    nodes {
        id
        path
        updatedAt
      }
    }
  }
`;

const musiciansQuery = gql`
  query Musicians {
    musicians (filter: {
    published: {
      equalTo: true,
    }
  }) {
     nodes {
        id
        path
        updatedAt
      }
    }
 }
`;

const scoresQuery = gql`
  query Scores {
    scores (filter: {
    published: {
      equalTo: true,
    }
  }) {
     nodes {
        id
        path
        updatedAt
      }
    }
 }
`;

function done(content) {
  console.log(getSitemapTemplate(content));
}

export default async function generate() {
  let sitemapContent = "";
  let dataLoadedIndex = 0;
  const lengs = Object.keys(languages);

  lengs.forEach(async lang => {
    // Add static pages to sitemap
    staticRoutes.forEach(route => {
      const url = host + route.path.replace(":locale", lang);
      sitemapContent += getSitemapBlock({ url });
    });

    // Fetch articles, musicians and scores
    const articleResponse = await fetchGraphData(
      getOptions(articleQuery, lang)
    );
    const musiciansResponse = await fetchGraphData(
      getOptions(musiciansQuery, lang)
    );
    const scoresResponse = await fetchGraphData(getOptions(scoresQuery, lang));

    articleResponse.data.articles.nodes.forEach(article => {
      const url = `${host}/${lang}/news/${article.path}/${article.id}`;
      sitemapContent += getSitemapBlock({ url, lastMod: article.updatedAt });
    });

    musiciansResponse.data.musicians.nodes.forEach(musician => {
      const url = `${host}/${lang}/musician/${musician.path}/${musician.id}`;
      sitemapContent += getSitemapBlock({ url, lastMod: musician.updatedAt });
    });

    scoresResponse.data.scores.nodes.forEach(score => {
      const url = `${host}/${lang}/music-sheet-score/${score.path}/${score.id}`;
      sitemapContent += getSitemapBlock({ url, lastMod: score.updatedAt });
    });

    ++dataLoadedIndex;

    if (dataLoadedIndex === lengs.length - 1) {
      done(sitemapContent);
    }
  });
}
