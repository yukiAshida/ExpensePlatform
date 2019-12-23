import React, {Component} from 'react';
import {SelectBox} from '../ui_component/select'

import {purpose_options} from '../../statics/settings'
import "../../statics/css/purpose.css"

export const Purpose = (props)=>{

    var W = props.width || "30%";
    var H = props.height || "200px";

    return (
        <div id="purpose" className="flex-column" style={{width:W, height:H}}>
            <SelectBox 
                values={purpose_options}
                label="目的"
                onChange={(e)=>props.onChange(e)} 
                width="80%"
                selected_value={props.selected_value}
            />
        </div>
    );
}
