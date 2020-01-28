import React, { useCallback } from 'react';
import clsx from 'clsx';
import PropTypes from 'prop-types';
import InfiniteScroll from 'react-infinite-scroller';
import CircularProgress from '@material-ui/core/CircularProgress';
import lodashDebounce from 'lodash.debounce';

import { Typography } from '@material-ui/core';

import { withI18n } from 'localization/helpers';

import { updateQueryWithNodes } from '_graphql/helpers';

function SectionWithFetchMore(props) {
  const {
    i18n,
    items,
    direction,
    fetchMore,
    isLoading,
    renderItem,
    hasNextPage,
    queryDataKey,
    wrapperClassName,
    WrapperComponent,
  } = props;

  const handleFetchMore = useCallback(lodashDebounce(() => {
    fetchMore({
      variables: {
        offset: items.length,
      },
      updateQuery: updateQueryWithNodes(queryDataKey),
    });
  }, 100), [items, fetchMore]);

  const isRow = direction === 'row';

  return (
    <InfiniteScroll
      pageStart={0}
      initialLoad={false}
      hasMore={hasNextPage}
      loadMore={handleFetchMore}
    >
      <WrapperComponent
        className={clsx(
          'mrg-top-15 justify-center',
          {
            'wrap': isRow,
            'flex-row': isRow,
            'align-center': isRow,
            'flex-column': direction === 'column',
          },
          wrapperClassName,
        )}
      >
        {items.length
          ? items.map(renderItem)
          : !isLoading && (
          <Typography
            variant="h6"
            color="textSecondary"
          >
            {i18n('noData')}
          </Typography>
        )}
      </WrapperComponent>
      {isLoading && (
        <div className="mrg-top-15 flex-row align-center grow justify-center">
          <Typography
            color="textSecondary"
          >
            {i18n('loading')}
          </Typography>

          <CircularProgress
            size={18}
            className="mrg-sides-10"
          />
        </div>
      )}
    </InfiniteScroll>
  );
}

SectionWithFetchMore.defaultProps = {
  isLoading: false,
  direction: 'row',
  hasNextPage: false,
  itemCountPerRequest: 1,
  WrapperComponent: props => <div {...props} />,
};

SectionWithFetchMore.propTypes = {
  i18n: PropTypes.func,
  isLoading: PropTypes.bool,
  fetchMore: PropTypes.func,
  wrapperClassName: PropTypes.string,
  itemCountPerRequest: PropTypes.number,
  renderItem: PropTypes.func.isRequired,
  hasNextPage: PropTypes.bool.isRequired,
  WrapperComponent: PropTypes.elementType,
  queryDataKey: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.shape({})),
  direction: PropTypes.oneOf(['row', 'column']),
};

export default withI18n(SectionWithFetchMore);
