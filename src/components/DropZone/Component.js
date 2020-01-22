import React from 'react';
import { useDropzone } from 'react-dropzone';

import RootRef from '@material-ui/core/RootRef';

import { noop } from 'helpers';

import './styles.sass';

function DropZone(props) {
  const {
    onFileUpload,
    multiple,
    children,
  } = props;

  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    onDrop: onUpload,
    multiple,
  });

  function onUpload(files) {
    const hasMultipleFiles = multiple && files.length > 1;
    const uploadedData = hasMultipleFiles ? files : files[0];

    onFileUpload(uploadedData);
  }

  const {
    ref,
    ...rootProps
  } = getRootProps();

  return (
    <RootRef rootRef={ref}>
      <div {...rootProps} className="anm-dropzone-root">
        <input {...getInputProps()} />
        {children}
      </div>
    </RootRef>
  );
}

DropZone.defaultProps = {
  onFileUpload: noop,
  multiple: false,
};

export default DropZone;
