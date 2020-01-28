import { getOptions, fetchGraphData } from "../utils";

// Fetch query for news which are published
const query = id => `
  query {
    score (id: ${id}) {
      title
      description
    }
  }
`;

export const getSingleScoreData = async (id, locale, url) => {
  try {
    const res = await fetchGraphData(getOptions(query(id), locale));
    const { score } = res.data || {};
    if (score) {
      return {
        url,
        locale,
        description: score.description,
        title: score.title
      };
    } else {
      return {
        title: "Not Found",
        content: "No Score Found"
      };
    }
  } catch (err) {
    console.log("Error fetching News --> : ", err);
  }
};
