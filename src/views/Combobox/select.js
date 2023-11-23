import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { memo } from 'react';
import classNames from 'classnames/bind';
import styles from './Select.module.scss';
import { useRef, useEffect, useState } from 'react';
function Select({ options, onChange }) {
    const cx = classNames.bind(styles);
    const [value, setValue] = useState(options[0]);
    console.log('rerender');
    const handleChange = (event, newValue) => {
        onChange(event, newValue);
        setValue(newValue);
    };
    return (
        <div>
            <Autocomplete
                value={value}
                size="small"
                sx={{ width: 300 }}
                options={options}
                getOptionLabel={(option) => option}
                renderInput={(params) => <TextField {...params} variant="standard" placeholder="Select" />}
                onChange={handleChange}
            />
        </div>
    );
}

export default memo(Select);
