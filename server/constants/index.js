const { HOST } = process.env

export const dynamicRoutes = [
  '/:locale/news/:path/:id',
  '/:locale/musician/:path/:id',
  '/:locale/music-sheet-score/:path/:id'
]

export const appDefaultData = {
  title: 'Armenian National music',
  imageUrl: `${HOST}/anm.png`,
  content:
    'Online platform which gives our users the possibility to listen, share and get more insight in Armenian music is sorted by epoch and genre.',
  description:
    'Online platform which gives our users the possibility to listen, share and get more insight in Armenian music is sorted by epoch and genre.',
  keywords:
    'Armenian Music,Հայ երաժշտություն,Armenia,Հայաստան,Music,Երաժշտություն,Khachatryan,Խաչատրյան,Mirzoyan,Միրզոյան,Babajanyan,Բաբաջանյան,Armenian,Հայկական,Yerevan,Երևան,News,Լուրեր,Kim,Կիմ,Kardashyan,Քարդաշյան,Kim Kardashyan,Քիմ Քարդաշյան,Media,Մեդիա,Violin,Ջութակ,Piano,Դաշնամուր,Duduk,Դուդուկ,Shvi,Շվի,Composer,Կոմպոզիտոր,Komitas,Կոմիտաս'
}
