import React, { useCallback, useState, useEffect } from 'react';

import { useLazyQuery } from '@apollo/react-hooks';

import Dialog from '@material-ui/core/Dialog';
import CloseIcon from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import { withToastActions } from 'containers/ToastMessages';

import Icon from 'components/Icon';
import Select from 'components/Select';
import Button from 'components/Button';
import Loading from 'components/Loading';

import withUser from 'hoc/withUser';

import { withI18n } from 'localization/helpers';
import { getCurrentLang } from 'localization/helpers';
import {
  FETCH_SCORE_PURCHASE_LINK,
} from '_graphql/actions/scores';

import {
  SCORE_DETAIL,
} from 'localization/constants';

import { downloadLink } from 'utils';

import countryList from 'pages/Scores/ScoreDetails/BuyScoreDialog/countries';

import ScoreDetailsInfo from 'pages/Scores/ScoreDetails/ScoreDetailsInfo';

import 'pages/Scores/ScoreDetails/BuyScoreDialog/styles.sass';

const countryOptions = countryList.map(country => ({
  label: country.name,
  value: country.code,
}));

const locale = getCurrentLang();

function BuyScoreDialog (props) {
  const [isPurchaseLoading, setPurchaseLoadingStatus] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(locale === 'hy' ? 'AM' : null);
  const [isDialogOpen, setDialogStatus] = useState(false);
  const [fetchScorePurchaseLink, { data, loading: isPurchaseLinkLoading }] = useLazyQuery(FETCH_SCORE_PURCHASE_LINK, {
    onError: () => {
      setPurchaseLoadingStatus(false);
      return props.addToastMessage.error(i18n('somethingWrong'));
    }
  });

  useEffect(() => {
    if (data) {
      if (data && data.scorePurchaseLink) {
        window.location.href = data.scorePurchaseLink;
      } else {
        setPurchaseLoadingStatus(false);
        props.addToastMessage.error(props.i18n('somethingWrong'));
      }
    }
  }, [props, setPurchaseLoadingStatus, data]);

  const {
    i18n,
    score,
    addToastMessage,
    isScorePurchased,
    userShouldBeLoggedIn,
  } = props;

  const buttonText = isScorePurchased
    ? i18n('download')
    : i18n(`continue`);
  const isArm = selectedCountry === 'AM';
  const currency = isArm
    ? 'AMD'
    : 'USD';
  const currencyName = isArm
    ? i18n(`${SCORE_DETAIL}.dram`)
    : '$';

  const handleBtnClick = useCallback(() => {
    if (isScorePurchased && userShouldBeLoggedIn()) {
      downloadLink(score.url, `${score.title} - (anmmedia.am).pdf`);
    } else {
      setDialogStatus(true);
    }
  }, [score, setDialogStatus, userShouldBeLoggedIn, isScorePurchased]);

  const closeDialog = useCallback(() => {
    setDialogStatus(false);
  }, [setDialogStatus]);

  const handleSubmit = useCallback(() => {
    if (!userShouldBeLoggedIn()) {
      return false;
    }

    setPurchaseLoadingStatus(true);
    try {
      fetchScorePurchaseLink({
        variables: {
          currency,
          scoreId: score.id,
          country: selectedCountry,
          redirect: window.location.href,
        },
      });
    } catch {
      addToastMessage.error(i18n('somethingWrong'));
      setPurchaseLoadingStatus(false);
    }
  }, [
    i18n,
    score.id,
    currency,
    addToastMessage,
    selectedCountry,
    userShouldBeLoggedIn,
    fetchScorePurchaseLink,
    setPurchaseLoadingStatus,
  ]);

  const prices = JSON.parse(score.prices || null);
  const scorePrice = ((prices || []).find(cur => currency === cur.currency) || {}).amount;

  const isLoading = isPurchaseLinkLoading || isPurchaseLoading;

  return (
    <>
      <div className="flex-row justify-end align-center">
        <Button
          variant="success"
          onClick={handleBtnClick}
        >
          {buttonText}
        </Button>
      </div>

      <Dialog
        fullWidth
        maxWidth="sm"
        scroll="paper"
        open={isDialogOpen}
        onClose={closeDialog}
      >
        <div className="flex-row nowrap justify-between pad-20">
          <Typography
            variant="h5"
            title={score.title}
            className="font-bold truncate grow"
          >
            {score.title}
          </Typography>

          <Icon onClick={closeDialog}>
            <CloseIcon/>
          </Icon>
        </div>
        <DialogContent
          dividers="true"
        >
          <Loading
            isLoading={isLoading}
          >
            <Select
              options={countryOptions}
              className="mrg-bottom-15"
              placeholder={i18n(`${SCORE_DETAIL}.choseCountry`)}
              onChange={option => setSelectedCountry(option.value)}
              value={countryOptions.find(opt => opt.value === selectedCountry)}
            />
            <Typography color="textSecondary">
              {score.description}
            </Typography>

            <ScoreDetailsInfo
              score={score}
            />
            {selectedCountry && (
              <div className="flex-row justify-end grow mrg-top-15">
                <Typography
                  variant="h6"
                  color="primary"
                  className="font-bold"
                >
                  {i18n(`${SCORE_DETAIL}.price`)} - {isArm ? `${scorePrice} ${currencyName}` : `$${scorePrice}`}
                </Typography>
              </div>
            )}
          </Loading>
        </DialogContent>
        <DialogActions className="pad-20">
          <Button
            variant="ghost-blue"
            onClick={closeDialog}
          >
            {i18n('close')}
          </Button>
          <Button
            variant="success"
            onClick={handleSubmit}
            disabled={!selectedCountry || isLoading}
          >
            {i18n(`continue`)}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

BuyScoreDialog.defaultProps = {};

BuyScoreDialog.propTypes = {};

export default withI18n(
  withUser(
    withToastActions(
      BuyScoreDialog
    )
  )
);
