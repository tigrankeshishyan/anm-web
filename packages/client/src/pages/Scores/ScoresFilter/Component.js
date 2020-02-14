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
  FETCH_INSTRUMENTS,
} from '_graphql/actions';

import {
  SCORES,
} from 'localization/constants';

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
  instrumentId: '',
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
  
  const { data: { instrumentsList = [] } = {} } = useQuery(FETCH_INSTRUMENTS);
  
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
  
  const handleSelectFieldChange = useCallback(valueKey => value => {
    setState(state => ({
      ...state,
      [valueKey]: value[valueKey],
    }));
  }, [setState]);
  
  const handleFilterSubmit = useCallback(() => {
    const filterData = {
      filter: {
        scoreLocalesBySourceId: {
          some: {
            title: {
              includesInsensitive: state.searchText,
            }
          },
        }
      }
    };
    
    if (state.composerId) {
      filterData.filter.or = {
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
    
    
    if (state.instrumentId) {
      let filterBlockRef = filterData.filter.or
        ? filterData.filter.or
        : filterData.filter;
      
      filterBlockRef.or = {
        scoreInstruments: {
          some: {
            instrumentId: {
              equalTo: state.instrumentId,
            },
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
  
  const musiciansOptions = instrumentsList.map(ins => ({
    label: ins.name,
    value: ins.id,
  }));
  
  return (
    <>
      <div
        onClick={openPopover}
        className="pointer flex-row align-center nowrap"
      >
        <span className="mrg-sides-10">
         {i18n('search')}
        </span>
        <SearchIcon
          className="anm-icon pointer"
        />
      </div>
      
      <Popover
        anchorEl={anchorEl}
        open={isPopoverOpen}
        transitionDuration={0}
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
            placeholder={i18n(`${SCORES}.chooseComposer`)}
            onChange={handleSelectFieldChange('composerId')}
          />
          
          <Select
            isClearable
            name="instrumentId"
            className="form-field"
            options={musiciansOptions}
            value={state.instrumentId}
            placeholder={i18n(`${SCORES}.chooseInstrument`)}
            onChange={handleSelectFieldChange('instrumentId')}
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
