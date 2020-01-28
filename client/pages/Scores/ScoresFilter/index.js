// TODO: Join score and musician filters to generic component
import React, { useState, useCallback } from 'react';
import { useQuery } from '@apollo/react-hooks';
import lodashGet from 'lodash.get';

import Popover from '@material-ui/core/Popover';
import SearchIcon from '@material-ui/icons/Search';

import { withI18n } from 'localization/helpers';

import Button from 'components/Button';
import { Select, TextField } from 'components/Form';

import {
  FETCH_MUSICIANS,
} from '_graphql/actions';

import {
  SCORES,
} from 'locales/constants';

import './styles.sass';

const anchorOrigin = {
  vertical: 'bottom',
  horizontal: 'left',
};

const transformOrigin = {
  vertical: 'top',
  horizontal: 'left',
};

const defaultFilterData = {
  searchText: '',
  composerId: '',
};

function ScoresFilter(props) {
  const { data: { musicians } = {} } = useQuery(FETCH_MUSICIANS, {
    variables: {
      filter: {
        type: {
          equalTo: 'composer',
        }
      }
    }
  });

  const [isPopoverOpen, setPopoverOpenStatus] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [state, setState] = useState(defaultFilterData);

  const {
    i18n,
    onFilter,
  } = props;

  const openPopover = useCallback((e) => {
    setAnchorEl(e.currentTarget);
    setPopoverOpenStatus(true);
  }, [setAnchorEl, setPopoverOpenStatus]);

  const closePopover = useCallback(() => {
    setPopoverOpenStatus(false);
  }, [setPopoverOpenStatus]);

  const handleScoreSearchChange = useCallback(value => {
    setState(state => ({
      ...state,
      searchText: value.searchText,
    }));
  }, [setState]);

  const handleComposerChange = useCallback(value => {
    setState(state => ({
      ...state,
      composerId: value.composerId,
    }));
  }, [setState]);


  const handleFilterSubmit = useCallback(() => {
    const filterData = {
      filter: {
        or: {
          scoreLocalesBySourceId: {
            some: {
              title: {
                includesInsensitive: state.searchText,
              }
            },
          }
        }
      }
    };

    if (state.composerId) {
      filterData.filter.or.or = {
        composition: {
          musicianCompositions: {
            some: {
              musician: {
                id: {
                  equalTo: state.composerId,
                }
              },
            }
          },
        }
      };
    }

    closePopover();
    onFilter(filterData.filter);
  }, [onFilter, closePopover, state]);

  const composersOptions = lodashGet(musicians, 'nodes', []).map(m => ({
    label: `${m.firstName} ${m.lastName}`,
    value: m.id,
  }));

  return (
    <>
      <SearchIcon
        onClick={openPopover}
        className="anm-icon pointer"
      />

      <Popover
        anchorEl={anchorEl}
        open={isPopoverOpen}
        onClose={closePopover}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      >
        <div className="flex-row wrap anm-filter-wrapper">
          <Select
            isClearable
            name="composerId"
            className="form-field"
            value={state.composerId}
            options={composersOptions}
            onChange={handleComposerChange}
            label={i18n(`${SCORES}.chooseComposer`)}
          />

          <TextField
            name="searchText"
            className="form-field"
            value={state.searchText}
            onChange={handleScoreSearchChange}
            placeholder={i18n(`${SCORES}.scoreName`)}
          />
        </div>

        <div className="flex-row justify-end mrg-bottom-15 pad-sides-15">
          <Button
            type="submit"
            variant="gradient"
            onClick={handleFilterSubmit}
          >
            {i18n('search')}
          </Button>
        </div>
      </Popover>
    </>
  );
}

ScoresFilter.defaultProps = {};

ScoresFilter.propTypes = {};

export default withI18n(ScoresFilter);
