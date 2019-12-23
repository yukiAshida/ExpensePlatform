import React, {Component} from 'react';
import {BlueButton,RedButton} from '../ui_component/button'
import {SelectBox, MultiSelectBox} from '../ui_component/select'
import {TextBox, PasswordBox} from '../ui_component/text'
import {CheckBox} from '../ui_component/check'
import {ReferenceDisplay} from './table'

import ArrowYesTrain from '../../statics/img/arrow_yes_train.png';
import ArrowNoTrain from '../../statics/img/arrow_no_train.png';
import ArrowYesBus from '../../statics/img/arrow_yes_bus.png';
import ArrowNoBus from '../../statics/img/arrow_no_bus.png';

import '../../statics/css/route.css';
import '../../statics/css/table.css';


export const ReferenceEditor = (props)=>{

    return (
        <div className="flex-row-center" style={{width:"100%", margin:"20px"}}>
            
            <div style={{width:"50%", marginRight:"60px"}}>
                <Table 
                    reference_list={props.reference_list} 
                    selected={props.reference_selected} 
                    onClick={(e,alias)=>props.onClickReferenceTable(e,alias)}
                />
            </div>

            <div style={{width:"50%"}}>
                {props.reference_selected!="" && 
                    <Route 
                        route_list={props.reference_information["route_list"]}
                        trans_list={props.reference_information["trans_list"]}
                        fare={props.reference_information["fare"]}
                        alias={props.reference_information["alias"]}
                        onClickArrow={(e,which,i)=>props.onClickArrow(e,which,i)}
                        onChange={(e,i)=>props.onChangeRoute(e,i)}
                        onChangeFare={(e)=>props.onChangeFare(e)}
                        onChangeAlias={(e)=>props.onChangeAlias(e)}
                        onClickIDButton = {(e,label)=>props.onClickIDButton(e,label)}
                        onClickDeleteReference={(e)=>props.onClickDeleteReference(e)}
                        onClickUpdateReference={(e)=>props.onClickUpdateReference(e)}
                    />
                }
            </div>

        </div>
    );
}

const Table = (props)=>{

    var reference_list = [];
    for(var alias in props.reference_list){
        var route_fare_set = props.reference_list[alias].split("%:%");
        
        var route = route_fare_set[0].replace(/%=%/g, "=").replace(/%-%/g, "-");
        var fare = route_fare_set[1]+"円";
        
        reference_list.push({"alias":alias, "route":route, "fare":fare});
    }

    return (
        <table>
            <tr className="header">
                <th>登録名</th>
                <th>経路</th>
                <th>運賃</th>
            </tr>
            
            {reference_list.map((values,ci) => {
                return <tr key={ci} className={props.selected==values["alias"]?"tr-selected":"tr-no-selected"} onClick={(e)=>props.onClick(e, values["alias"])}>
                    <td>{values["alias"]}</td>
                    <td>{values["route"]}</td>
                    <td>{values["fare"]}</td>
                </tr>
            })}

        </table>                
    );
}

const Route = (props)=>{


    // props.route_list : ["A station", "B station", ...]
    // props.trans_list : ["t", "b", "t", ...]
    // props.fare : "500"(金額)
    // props.alias : "station A to B"
    // props.onClickArrow = func(e, which, i)
    // props.onChange = func(e, i)
    // props.onChangeFare = func(e)
    // props.onChangeAlias = func(e)
    // props.onClickIDButton = func(e, label)


    // 経路表示用の連番配列
    var n_route = props.trans_list.length;
    var n_sequence = [...Array(n_route).keys()]

    return (
        <div className="route-input-container">

            <div className="route-input-left">
                
                <div id="alias-zone">
                    <TextBox width="90%" value={props.alias} onChange={props.onChangeAlias}/>
                </div>

                {/* 1つ目の経路 */}
                <TextBox margin="10px" width="90%" value={props.route_list[0]} onChange={(e)=>props.onChange(e,0)}/>

                {/* 移動手段＋2つ目以降の経路 */}
                {n_sequence.map((i) => {
                    return <div key={i} style={{width:"100%"}} className="flex-column">
                        <ArrowComponent which={props.trans_list[i]} onClick={(e, which)=>props.onClickArrow(e, which, i) }/>
                        <TextBox margin="10px" width="90%" value={props.route_list[i+1]} onChange={(e)=>props.onChange(e,i+1)}/>            
                    </div>;
                })}
                
                {/* 金銭 */}
                <div id="fare-zone">
                    <TextBox width="90%" value={props.fare} onChange={props.onChangeFare}/>
                </div>
            </div>

            <div className="route-input-right">
                <BlueButton width="100%" value="縮める" onClick={(e)=>props.onClickIDButton(e, "D")}/>
                <BlueButton width="100%" value="伸ばす" onClick={(e)=>props.onClickIDButton(e, "I")}/>
                <BlueButton width="100%" value="更新" onClick={(e)=>props.onClickUpdateReference(e)} margin="100px 20px 20px 20px"/>
                <RedButton width="100%" value="削除" onClick={(e)=>props.onClickDeleteReference(e)}/>
            </div>
        
        </div>
    );
}

const ArrowComponent = (props) => {
    //props.which : "t" or "b" (クリックされたのがtrain側かbus側か)
    
    // 矢印のデフォルトサイズ
    var arrow_size = "30%";
    
    // 画像パスの指定
    var arrow_left = props.which=="t"?ArrowYesTrain:ArrowNoTrain;
    var arrow_right = props.which=="t"?ArrowNoBus:ArrowYesBus;

    // 左側の矢印はコールバック関数に"t"(train)を、右側の矢印は"b"(bus)を渡す
    // 上から何番目かの矢印かは、親コンポーネントで指定
    return(
        <div className="flex-row-center">
            <img src={arrow_left} alt="" width={arrow_size} height={arrow_size} onClick={(e)=>props.onClick(e, "t")}></img>
            <img src={arrow_right} alt="" width={arrow_size} height={arrow_size} onClick={(e)=>props.onClick(e, "b")}></img>
        </div>
    );
}