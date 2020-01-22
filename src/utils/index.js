/**
 * Function to create file entirely on client and initiate download
 * @param {string} link - the downloadable file's link
 * @param {string} filename - the downloadable file's name
 * @returns {void}
 */
export const downloadLink = (link, filename = 'download') => {
  // Creating anchor to force a download
  const element = document.createElement('a');

  // Preparing anchor element
  element.setAttribute('href', link);
  element.setAttribute('target', '_blank');
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  // Starting download
  element.click();
  // Clearing up the DOM
  document.body.removeChild(element);
};

/**
 * Function to create file entirely on client and initiate download
 * @param {string} filename - filename to be downloaded
 * @param {string} content - file content
 * @param {string} type - MIME type of the file
 * @param {boolean} isBinary - flag if file content is binary and not text
 * @returns {void}
 */
export const downloadFile = (filename, content = '', type = 'text/plain', isBinary = false) => {
  if (!filename) {
    throw new Error('Download error: file name is not specified!');
  }

  // Adding charset if content is not binary
  const anchorPrefix = isBinary
    ? `data:${type};`
    : `data:${type};charset=utf-8,`;

  const link = anchorPrefix + encodeURIComponent(content);
  downloadLink(link, filename);
};
