import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { memo } from 'react';
import classNames from 'classnames/bind';
import styles from './scss/DropZone.module.scss';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
function DropZone({ setFile, type }) {
    const cx = classNames.bind(styles);
    const onDrop = useCallback((acceptedFiles) => {
        setFile(acceptedFiles[0]);
    }, []);
    const [acceptType, setAcceptType] = useState();

    useEffect(() => {
        type && type === 'IMG'
            ? setAcceptType({
                  'image/jpeg': [],
                  'image/png': [],
              })
            : setAcceptType({ 'video/mp4': [], 'video/quicktime': [] });
    }, [type]);

    const { isDragActive, acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: acceptType,
    });

    const acceptedFileItems = acceptedFiles.map((file) => (
        <li key={file.path}>
            {file.path} - {file.size} bytes
        </li>
    ));
    return (
        <>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className={cx('drag-image')}>
                    <div className={cx('icon')}>
                        <DriveFolderUploadOutlinedIcon />
                    </div>
                    {isDragActive ? (
                        <p>Drop the files here ...</p>
                    ) : (
                        <>
                            <h6>Drag & Drop File Here</h6>
                            <span>OR</span>
                            <button>Browse File</button>
                        </>
                    )}
                </div>
            </div>
            <aside>
                <p>File đã chọn</p>
                <ul>{acceptedFileItems}</ul>
            </aside>
        </>
    );
}
export default memo(DropZone);
