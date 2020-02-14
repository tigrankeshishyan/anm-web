import React from 'react';

import SectionTitle from 'components/SectionTitle';

import { withI18n } from 'localization/helpers';

import { ReactComponent as AnpoLogo } from 'images/partners/anpo.svg';
import { ReactComponent as AgbuLogo } from 'images/partners/agbu.svg';
import { ReactComponent as HoverChoirLogo } from 'images/partners/hover.svg';
import { ReactComponent as AssonanceLogo } from 'images/partners/assonance.svg';
import { ReactComponent as QuartertoneLogo } from 'images/partners/quartertone.svg';
import { ReactComponent as AvetisAssociationLogo } from 'images/partners/avetis.svg';
import { ReactComponent as ConservatoryLogo } from 'images/partners/conservatory.svg';
import { ReactComponent as KomitasInstituteLogo } from 'images/partners/komitas-museum.svg';
import { ReactComponent as YerevanStringQuartetLogo } from 'images/partners/yerevan-quertet.svg';
import { ReactComponent as KhachatryanHomeMuseumLogo } from 'images/partners/khachatryan-museum.svg';

import './styles.sass';

// logoName is the partner logo file name without extension
const logos = [
  {
    logo: AgbuLogo,
    website: 'https://agbu.org',
    title: 'AGBU',
  },
  {
    logo: AvetisAssociationLogo,
    website: ' http://www.avetis.ch',
    title: 'Avetis Association',
  },
  {
    logo: KomitasInstituteLogo,
    website: 'https://www.gomidas.org',
    title: 'Komitas Museum-Institute',
  },
  {
    logo: ConservatoryLogo,
    website: 'http://www.khachaturian.am/eng/museum.htm',
    title: 'Aram Khachatryan Home Museum',
  },
  {
    logo: KhachatryanHomeMuseumLogo,
    website: 'https://conservatory.am',
    title: 'Yerevan Komitas State Conservatory',
  },
  {
    logo: AnpoLogo,
    website: 'https://apo.am',
    title: 'Armenian National Philharmonic Orchestra',
  },
  {
    logo: HoverChoirLogo,
    website: 'http://hoverchoir.org',
    title: 'Hover Choir',
  },
  {
    logo: QuartertoneLogo,
    website: 'https://www.quartertone.org',
    title: 'Quarter Tone',
  },
  {
    logo: AssonanceLogo,
    website: 'https://www.facebook.com/ensembleassonance',
    title: 'Assonance Ensemble',
  },
  {
    logo: YerevanStringQuartetLogo,
    website: 'https://www.facebook.com/Yerevanquartet/',
    title: '"Yerevan" String Quartet',
  },
];

function HomePartnersSection(props) {
  const { i18n } = props;

  return (
    <div className="partners-section-wrapper">
      <SectionTitle
        type="normal"
        position="right"
        blockWidth="70%"
        title={i18n('ourPartners')}
      />

      <div className="flex-row wrap justify-center pad-20 partners-logo-wrapper">
        {logos.map(logo => (
          <a
            target="_blank"
            key={logo.website}
            href={logo.website}
            title={logo.title}
            rel="noopener noreferrer"
            className="partner-logo"
          >
            <logo.logo />
          </a>
        ))}
      </div>
    </div>
  );
}

export default withI18n(HomePartnersSection);
