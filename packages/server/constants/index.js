const { HOST } = process.env;

export const dynamicRoutes = [
  '/:locale/news/:path/:id',
  '/:locale/musician/:path/:id',
  '/:locale/music-sheet-score/:path/:id'
];

export const appDefaultData = {
  en: {
    title: 'Armenian National music',
    imageUrl: `${HOST}/anm.png`,
    description:
      'ANM is an online platform which has an aim to connect all Armenian artists and composers. Also introduce Armenian art of music to the world.',
    keywords:
      'Armenian Music,Հայ երաժշտություն,Armenia,Հայաստան,Music,Երաժշտություն,Khachatryan,Խաչատրյան,Mirzoyan,Միրզոյան,Babajanyan,Բաբաջանյան,Armenian,Հայկական,Yerevan,Երևան,News,Լուրեր,Kim,Կիմ,Kardashyan,Քարդաշյան,Kim Kardashyan,Քիմ Քարդաշյան,Media,Մեդիա,Violin,Ջութակ,Piano,Դաշնամուր,Duduk,Դուդուկ,Shvi,Շվի,Composer,Կոմպոզիտոր,Komitas,Կոմիտաս'
  },
  hy: {
    title: 'Armenian National music',
    imageUrl: `${HOST}/anm.png`,
    description:
      'ANM-ը Օնլայն հարթակ է, որը նպատակ ունի համախմբել Հայ կատարողներին և կոմպոզիտորներին, ինչպես նաև ներկայացնել հայ երաժշտարվեստը աշխարհին։',
    keywords:
      'Armenian Music,Հայ երաժշտություն,Armenia,Հայաստան,Music,Երաժշտություն,Khachatryan,Խաչատրյան,Mirzoyan,Միրզոյան,Babajanyan,Բաբաջանյան,Armenian,Հայկական,Yerevan,Երևան,News,Լուրեր,Kim,Կիմ,Kardashyan,Քարդաշյան,Kim Kardashyan,Քիմ Քարդաշյան,Media,Մեդիա,Violin,Ջութակ,Piano,Դաշնամուր,Duduk,Դուդուկ,Shvi,Շվի,Composer,Կոմպոզիտոր,Komitas,Կոմիտաս'
  }
};

export const appAboutUsData = {
  en: {
    title: 'Armenian National music',
    imageUrl: 'https://anmmedia.am/images/9e9a1ed8-aa6b-4eb4-8b48-5b735dca4e30',
    content:
      "Armenian National Music Organization was founded by Tigran Keshishyan, Sergey Umroyan and Astghik Martirosyan on May 7, 2013. ANM's main goal is to create an up-to-date digital collection of the recordings of the Armenian folkloric, traditional, sacred and classical music.\n" +
      '\n' +
      "To this date, thousands of audio recordings have been restored, processed, digitalized and presented through the organization's website.\n" +
      '\n' +
      'In addition, we have also digitalized thousands of pages of sheet music, aiming at the complete digitalization of the Armenian composers works.',
    description:
      'Armenian National Music Organization was founded by Tigran Keshishyan, Sergey Umroyan and Astghik Martirosyan on May 7, 2013.'
  },
  hy: {
    title: 'Armenian National music',
    imageUrl: 'https://anmmedia.am/images/9e9a1ed8-aa6b-4eb4-8b48-5b735dca4e30',
    content:
      'Armenian National Music-ը հիմնադրվել է 2013թ. մայիսի 7-ին Տիգրան Քեշիշյանի, Սերգեյ Ումրոյանի և Աստղիկ Մարտիրոսյանի կողմից։ Նպատակն էր ստեղծել միջազգային չափանիշներին համապատասխան թվային ձայնադարան՝ ներառելով ժողովրդական (ֆոլկլոր), գուսանա֊աշուղական, հոգևոր և կոմպոզիտորական ստեղծագործություններ։\n' +
      '\n' +
      'Մինչ օրս վերականգնվել, վերամշակվել և թվայնացվել են հազարավոր աուդիո ձայնագրություններ, որոնք ներկայացվել են հանրությանը կայքի միջոցով։ Թվայնացվել են նաև նոտագրության հազարավոր էջեր՝ նպատակ ունենալով ամբողջությամբ թվայնացնել հայ կոմպոզիտորական երաժշտության ժառանգությունը։',
    description:
      'Armenian National Music-ը հիմնադրվել է 2013թ. մայիսի 7-ին Տիգրան Քեշիշյանի, Սերգեյ Ումրոյանի և Աստղիկ Մարտիրոսյանի կողմից։'
  }
};

export const appContactUsData = {
  en: {
    title: 'Contact us - Armenian National music',
    description: 'Ֆուչիկի փ. 27/41, Աջափնյակ 0048, Երևան, Հայաստան'
  },
  hy: {
    title: 'Կապ մեզ հետ - Armenian National music',
    description: 'Fuchik str. 27/41, Ajapnyak 0048, Yerevan, Armenia'
  }
};
