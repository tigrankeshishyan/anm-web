import React from 'react';
import lodashGet from 'lodash.get';
import { useQuery } from '@apollo/react-hooks';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import SEO from 'components/SEO';
import Loading from 'components/Loading';
import PDFViewer from 'components/PDFViewer';

import { withI18n } from 'localization/helpers';

import {
  FETCH_SINGLE_SCORE,
  CHECK_IF_SCORE_PURCHASED,
} from '_graphql/actions/scores';

import withUser from 'hoc/withUser';

import {
  SCORE_DETAIL,
} from 'locales/constants';

import ContentSection from 'sections/ContentSection';

import BuyScoreDialog from 'pages/ScoreDetails/BuyScoreDialog';
import ScoreDetailsInfo from 'pages/ScoreDetails/ScoreDetailsInfo';

import 'pages/ScoreDetails/styles.sass';

const getId = props => Number(props.match.params.scoreId);

function ScoreDetails(props) {
  const {
    data: { score = {} } = {},
    loading: isScoreLoading,
  } = useQuery(FETCH_SINGLE_SCORE, {
    variables: {
      id: getId(props),
    },
  });

  const {
    data: { isScorePurchased } = {},
    loading: isScorePurchaseCheckLoading,
  } = useQuery(CHECK_IF_SCORE_PURCHASED, {
    variables: {
      scoreId: getId(props),
    },
  });

  const {
    i18n,
  } = props;

  const scoreUrl = lodashGet(score, 'url', '');
  const previewUrl = lodashGet(score, 'preview.url', '');

  const pdfUrl = isScorePurchased ? scoreUrl : previewUrl;

  return (
    <Loading isLoading={isScoreLoading || isScorePurchaseCheckLoading}>
      <SEO
        title={score.title}
        imageUrl={previewUrl}
        description={score.description}
      />

      <ContentSection className="anm-scores">
        <Grid
          container
          spacing={8}
          justify="space-around"
          className="mrg-top-15"
        >
          <Grid
            item
            md={6}
            xs={12}
          >
            {
              !isScorePurchaseCheckLoading && pdfUrl ? (
                <>
                  {
                    !isScorePurchased && (
                      <div className="mrg-vertical-half mrg-bottom-15">
                        <Typography color="textSecondary">
                          {i18n(`${SCORE_DETAIL}.pagesAvailability`)}
                        </Typography>
                      </div>
                    )
                  }
                  <PDFViewer
                    pdfUrl={pdfUrl}
                    className="score-preview-wrapper"
                  />
                </>
              ) : i18n('somethingWrong')
            }
          </Grid>

          <Grid
            item
            md={6}
            xs={12}
          >
            <div className="flex-column justify-center grow mrg-top-15">
              <Typography
                variant="h4"
                className="font-bold"
              >
                {score.title}
              </Typography>
              <div className="mrg-bottom-15">
                <Typography
                  variant="h6"
                  color="textSecondary"
                  className="pad-sides-10"
                >
                  {score.description}
                </Typography>
              </div>

              <ScoreDetailsInfo
                score={score}
              />
            </div>
            <div className="flex-row justify-end">
              {!isScorePurchaseCheckLoading && (
                <BuyScoreDialog
                  score={score}
                  isScorePurchased={isScorePurchased}
                />
              )}
            </div>
          </Grid>
        </Grid>
      </ContentSection>
    </Loading>
  );
}

ScoreDetails.defaultProps = {};

ScoreDetails.propTypes = {};

export default withI18n(
  withUser(
    ScoreDetails
  )
);