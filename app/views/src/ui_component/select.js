import React, {Component} from 'react';
import {BlueButton} from './button.js';
import '../../statics/css/select.css';

export const SelectBox = (props)=>{

    var W = props.width || "40%";
    var H = props.height || "40px";
    var F = props.fontsize || "20px";
    var M = props.margin || "20px";

    var values = props.values;
    var selected_value = props.selected_value;

    return (
        <div className="select-box select-key" style={{width:W, height:H, margin:M}}>
            <select onChange = {props.onChange} style={{fontSize:F}}>
                {selected_value=="" && <option value="" hidden>{props.label}</option>}
                
                {values.map(
                    (v, i) => { return v==selected_value?<option value={v} key style={{fontSize:F}} selected>{v}</option>:<option value={v} key style={{fontSize:F}}>{v}</option> }
                )}
                
            </select>
        </div>
    );
}

export const MultiSelectBox = (props)=>{

    var values = props.values;
    var n = props.selected_values.length;
    const sequence_array = Array.from(new Array(n)).map((v,i) => i)
    
    var selected_values = props.selected_values;

    return (

        <div className = "multi-select-box" style={{width:"100%"}}>

            {sequence_array.map(
                (v, i) => { return <SelectBox onChange={(e)=>props.onChange(e, i)} label={props.label} values={values} selected_value={selected_values[i]} key/> }
            )}
        
            <div className = "multi-select-box-buttons">
                <BlueButton onClick = {(e)=>props.onClick(e, "pop")} value = "削除" />
                <BlueButton onClick = {(e)=>props.onClick(e, "push")} value = "追加" />
            </div>
        </div>    

    );
}

