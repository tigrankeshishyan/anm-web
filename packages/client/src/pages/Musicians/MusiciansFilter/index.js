import React, { useState, useCallback } from 'react';
import Popover from '@material-ui/core/Popover';
import SearchIcon from '@material-ui/icons/Search';

import musicianTypes from '_constants/musicianTypes';
import { withI18n } from 'localization/helpers';
import { getCurrentLang } from 'localization/helpers';

import Button from 'components/Button';
import { Select, TextField } from 'components/Form';

import './styles.sass';

const labelKey = getCurrentLang() === 'hy' ? 'labelArm' : 'label';

const anchorOrigin = {
  vertical: 'bottom',
  horizontal: 'left',
};

const transformOrigin = {
  vertical: 'top',
  horizontal: 'left',
};

// TODO: get musician types from server
const professionTypeOptions = musicianTypes.map(m => ({
  label: m[labelKey],
  value: m.value,
}));

const defaultFilterData = {
  selectedTypes: professionTypeOptions.map(m => m.value),
  firstName: '',
  lastName: '',
};

function MusiciansFilter(props) {
  const [isPopoverOpen, setPopoverOpenStatus] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTypes, setSelectedTypes] = useState(defaultFilterData.selectedTypes);
  const [musicianNameCreds, setMusicianNameCreds] = useState({
    lastName: defaultFilterData.lastName,
    firstName: defaultFilterData.firstName,
  });

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

  const handleArtistTypeFilterChange = useCallback(option => {
    setSelectedTypes(option.artistTypes);
  }, [setSelectedTypes]);

  const handleMusicianNameFilterChange = useCallback((option, fieldName) => {
    setMusicianNameCreds(creds => ({
      ...creds,
      [fieldName]: option[fieldName],
    }));
  }, [setMusicianNameCreds]);

  const handleFilterSubmit = useCallback(() => {
    const filterData = {};

    if (selectedTypes.length) {
      filterData.type = {
        in: selectedTypes,
      };
    }

    if (musicianNameCreds) {
      filterData.musicianLocalesBySourceId = {
        some: {
          firstName: {
            includesInsensitive: musicianNameCreds.firstName,
          },
          or: {
            lastName: {
              includesInsensitive: musicianNameCreds.lastName,
            },
          }
        }
      };
    }

    closePopover();
    onFilter(filterData);
  }, [
    onFilter,
    closePopover,
    selectedTypes,
    musicianNameCreds,
  ]);

  return (
    <>
      <div onClick={openPopover} className="pointer flex-row align-center nowrap">
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
        onClose={closePopover}
        anchorOrigin={anchorOrigin}
        transformOrigin={transformOrigin}
      >
        <div className="flex-row wrap pad-20 anm-musicians-filter-wrapper">
          <TextField
            name="firstName"
            className="form-field"
            value={musicianNameCreds.firstName}
            placeholder={i18n('form.firstName')}
            onChange={handleMusicianNameFilterChange}
          />

          <TextField
            name="lastName"
            className="form-field"
            value={musicianNameCreds.lastName}
            placeholder={i18n('form.lastName')}
            onChange={handleMusicianNameFilterChange}
          />

          <Select
            isMulti
            name="artistTypes"
            value={selectedTypes}
            className="form-field"
            label={i18n('activity')}
            options={professionTypeOptions}
            onChange={handleArtistTypeFilterChange}
            noOptionsMessage={() => i18n('noOtherProfessions')}
          />
        </div>

        <div className="pad-bottom-20 pad-sides-20">
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

MusiciansFilter.defaultProps = {};

MusiciansFilter.propTypes = {};

export default withI18n(MusiciansFilter);
