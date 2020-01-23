export const addImageProportions = (url = '', width, height, fitImage) => {
  if (typeof url!=='string' || !url || (!width && !height)) {
    return url;
  }

  let newUrl = url;
  const widthParam = width ? `width=${width}`:'';
  const heightParam = height ? `height=${height}`:'';
  const urlParams = `${widthParam}${heightParam ? `&${heightParam}`:''}`;
  const isUrlWithParams = url.indexOf('?')!== -1;

  newUrl += isUrlWithParams ? `&${urlParams}`:`?${urlParams}`;

  if (fitImage) {
    newUrl += '&fit=contain';
  }

  return newUrl;
};

export const createEmptyImg = (
  src,
  removeAfterMs,
  onload = () => {
  },
) => {
  const img = document.createElement('img');
  img.onload = onload;
  img.src = src;

  // img.style.visibility = 'hidden';

  if (removeAfterMs) {
    document.body.appendChild(img);
    setTimeout(() => {
      document.body.removeChild(img);
    }, removeAfterMs);
  }

  return img;
};
