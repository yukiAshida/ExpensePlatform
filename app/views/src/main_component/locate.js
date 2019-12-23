import React, {Component} from 'react';
import {SelectBox} from '../ui_component/select'
import {TextBox} from '../ui_component/text'

import {locate_options} from '../../statics/settings'
import "../../statics/css/locate.css"

export const Locate = (props)=>{

    var W = props.width || "30%";
    var H = props.height || "200px";

    return (
        <div id="locate" className="flex-column" style={{width:W, height:H}}>
            <SelectBox 
                values={locate_options}
                label="用務先"
                onChange={(e)=>props.onChange(e, "select")} 
                width="80%"
                selected_value={props.selected_value}
            />

            {props.state["select"]=="その他" && 
            <TextBox 
                label={"具体的な用務先"}  
                value={props.state["other"]} 
                onChange={(e)=>props.onChange(e,"other")} 
                width="80%"
            />}
        </div>
    );
}
