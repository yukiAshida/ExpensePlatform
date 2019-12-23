import React, {Component} from 'react';
import '../../statics/css/text.css';

export const TextBox = (props)=>{
    
    var W = props.width || "40%";
    var H = props.height || "50px";
    var F = props.fontsize || "20px";
    var M = props.margin || "20px";

    return (
        <div className="text-box" style={{width:W, height:H, margin:M}}>
            <label className="text-label">
                <input type="text" name={props.label=="メールアドレス"?"email":""} value={props.value} placeholder={props.label} onChange={props.onChange} style={{fontSize:F}}/>
            </label>
        </div>
    );

}


export const PasswordBox = (props)=>{
    
    var W = props.width || "40%";
    var H = props.height || "50px";
    var F = props.fontsize || "20px";    
    var M = props.margin || "20px";    

    return (
        <div className="password-box" style={{width:W, height:H, margin:M}}>
            <label className="password-label">
                <input type="password" value={props.value} placeholder={props.label} onChange={props.onChange} style={{fontSize:F}}/>
            </label>
        </div>
    );

}

          