import React, {Component} from 'react';
import '../../statics/css/button.css';

export const BlueButton = (props)=>{
    var W = props.width || "150px";
    var H = props.height || "50px";
    var F = props.fontsize || "20px";
    var M = props.margin || "20px";

    return (
        <a href="#!" className="blue-button" onClick={props.onClick} style={{width:W ,height:H, lineHeight:H, fontSize:F, margin:M}}>
            {props.value}
        </a>
    );
}

export const RedButton = (props)=>{
    var W = props.width || "150px";
    var H = props.height || "50px";
    var F = props.fontsize || "20px";
    var M = props.margin || "20px";

    return (
        <a href="#!" className="red-button" onClick={props.onClick} style={{width:W ,height:H, lineHeight:H, fontSize:F, margin:M}}>
            {props.value}
        </a>
    );
}

export const GreenButton = (props)=>{
    var W = props.width || "150px";
    var H = props.height || "50px";
    var F = props.fontsize || "20px";
    var M = props.margin || "20px";

    return (
        <a href="#!" className="green-button" onClick={props.onClick} style={{width:W ,height:H, lineHeight:H, fontSize:F, margin:M}}>
            {props.value}
        </a>
    );
}