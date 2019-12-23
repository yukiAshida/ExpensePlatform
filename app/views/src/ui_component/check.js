import React, {Component} from 'react';
import Button from '@material-ui/core/Button';

import '../../statics/css/check.css';

export const CheckBox = (props)=>{

    return (

        <div className="sample3Area" id="makeImg">
            <input type="checkbox" id="sample3check" checked={props.checked} onClick={props.onClick}/>
            <label htmlFor="sample3check">
            <span>{props.label}</span>
            </label>
        </div>
    );
}

