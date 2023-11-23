import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { memo } from 'react';
import classNames from 'classnames/bind';
import styles from './scss/DropZone.module.scss';
import DriveFolderUploadOutlinedIcon from '@mui/icons-material/DriveFolderUploadOutlined';
function DropZone({ setFile }) {
    const cx = classNames.bind(styles);
    const onDrop = useCallback((acceptedFiles) => {
        setFile(acceptedFiles[0]);
    }, []);
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

    return (
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
    );
}
export default memo(DropZone);
