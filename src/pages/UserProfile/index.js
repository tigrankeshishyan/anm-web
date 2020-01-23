import React, { useState, useCallback } from 'react';

import Tab from '@material-ui/core/Tab';
import Grid from '@material-ui/core/Grid';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import SEO from 'components/SEO';

import ContentSection from 'sections/ContentSection';

import { withI18n } from 'localization/helpers';

import withUser from 'hoc/withUser';

import UserForm from './UserForm';
import UserPurchases from './UserPurchases';

import {
  USER_PROFILE,
} from 'locales/constants';

const tabs = [
  {
    titleKey: 'info',
    value: 'userForm',
    Component: UserForm,
  },
  {
    titleKey: 'purchases',
    value: 'userPurchases',
    Component: UserPurchases,
  },
];

function UserProfile(props) {
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const {
    i18n,
  } = props;

  const handleTabChange = useCallback((event, tabValue) => {
      const tab = tabs.find(t => t.value === tabValue);
      setActiveTab(tab);
  }, []);

  return (
    <>
      <SEO
        titleTranslationId={`${USER_PROFILE}.personalInfo`}
      />

      {
        !props.user && (
          <div className="pad-sides-20 flex-row align-center justify-center">
            <Typography variant="h6">
              {i18n(`${USER_PROFILE}.emptyProfile`)}
            </Typography>
          </div>
        )
      }

      {
        props.user ? (
          <ContentSection>
            <Grid
              item
              md={6}
              xs={12}
              className="pad-sides-20"
            >
              <Tabs
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                value={activeTab.value}
                indicatorColor="primary"
                onChange={handleTabChange}
              >
                {tabs.map(tab => (
                  <Tab
                    disableRipple
                    key={tab.value}
                    value={tab.value}
                    label={i18n(`${USER_PROFILE}.${tab.titleKey}`)}
                  />
                ))}
              </Tabs>
              <div className="mrg-top-15">
                {<activeTab.Component />}
              </div>
            </Grid>
          </ContentSection>
        ) : null
      }
    </>
  );
}

UserProfile.defaultProps = {};

UserProfile.propTypes = {};

export default withI18n(withUser(UserProfile));
