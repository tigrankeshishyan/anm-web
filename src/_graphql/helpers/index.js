import lodashClone from 'lodash.clonedeep';
import lodashUniqBy from 'lodash.uniqby';

// TODO: fix the bad implementation
// Check why gatsby fetches data twice on infinite scrolling
export const updateQueryWithNodes = key => (prev, { fetchMoreResult }) => {
  if (!fetchMoreResult) {
    return prev;
  }

  const newData = lodashClone(fetchMoreResult);
  newData[key].nodes = lodashUniqBy([...prev[key].nodes, ...fetchMoreResult[key].nodes], 'id');

  return newData;
};
