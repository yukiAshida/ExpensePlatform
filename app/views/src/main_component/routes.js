import React,{Component} from 'react'
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

export class Route extends Component{

    constructor(props){
        super(props);
    }


    render(){

        var W = this.props.width || "80%"

        return(
            <div id="route-component" className="tabs" style={{width:W, height:"min-content"}}>

                {/* タブ1個目(input用) */}
                <input id="route_input" type="radio" name="tab_item" onClick={(e)=>this.props.onClickTab(e,"input")} checked={this.props.state["tab"]=="input"}/>
                <label className="tab_item" htmlFor="route_input">経路記入</label>

                {/* タブ2個目(registration用) */}
                <input id="route_registration" type="radio" name="tab_item" onClick={(e)=>this.props.onClickTab(e,"registration")} checked={this.props.state["tab"]=="registration"}/>
                <label className="tab_item" htmlFor="route_registration">経路登録</label>

                {/* タブ3個目(reference用) */}
                <input id="route_reference" type="radio" name="tab_item" onClick={(e)=>this.props.onClickTab(e,"reference")} checked={this.props.state["tab"]=="reference"}/>
                <label className="tab_item" htmlFor="route_reference">経路参照</label>

                {/* タブ1個目のコンテンツ(input用) */}
                <div className="tab_content" id="route_input_content">
                    <RouteComponent 
                        onClickRoundTrip={this.props.onClickRoundTrip}
                        onClickArrow={this.props.onClickArrow}
                        onChange = {this.props.onChange}
                        onChangeFare = {this.props.onChangeFare}
                        onClickIDButton = {this.props.onClickIDButton}
                        round_trip={this.props.state["round-trip"]}
                        route_list={this.props.state["route_list"]}
                        trans_list={this.props.state["trans_list"]}
                        fare={this.props.state["fare"]}
                    />
                </div>

                {/* タブ1個目のコンテンツ(input用) */}
                <div className="tab_content" id="route_registration_content">
                    <RegistrationComponent
                        route_list={this.props.state["route_list"]}
                        trans_list={this.props.state["trans_list"]}
                        fare={this.props.state["fare"]}
                        alias={this.props.state["alias"]}
                        onClickRegistration = {this.props.onClickRegistration}
                        onChangeAlias = {this.props.onChangeAlias}
                    />
                </div>
                
                {/* タブ2個目のコンテンツ(reference用) */}
                <div className="tab_content" id="route_reference_content">
                    <ReferenceComponent 
                        onClick = {this.props.onClickReference}
                        onClickRoundTrip={this.props.onClickRoundTrip}
                        reference_selected={this.props.state["reference_selected"]}
                        round_trip={this.props.state["round-trip"]}
                        reference_list={this.props.state["reference_list"]}
                    />
                </div>

            </div>
        );    
    }
}

const RouteComponent = (props)=>{

    // props.route_list : ["A station", "B station", ...]
    // props.trans_list : ["t", "b", "t", ...]
    // props.round_trip : boolean (往復かどうか)
    // props.fare : "500"(金額)
    // props.onClickRoundTrip = func(e)
    // props.onClickArrow = func(e, which, i)
    // props.onChange = func(e, i)
    // props.onChangeFare = func(e)
    // props.onClickIDButton = func(e, label)

    // 経路表示用の連番配列
    var n_route = props.trans_list.length;
    var n_sequence = [...Array(n_route).keys()]

    return (
        <div className="route-input-container">

            <div className="route-input-left">
                
                {/* 1つ目の経路 */}
                <TextBox label="駅・バス停名" margin="10px" width="90%" value={props.route_list[0]} onChange={(e)=>props.onChange(e,0)}/>

                {/* 移動手段＋2つ目以降の経路 */}
                {n_sequence.map((i) => {
                    return <div key={i} style={{width:"100%"}} className="flex-column">
                        <ArrowComponent which={props.trans_list[i]} onClick={(e, which)=>props.onClickArrow(e, which, i) }/>
                        <TextBox label="駅・バス停名" margin="10px" width="90%" value={props.route_list[i+1]} onChange={(e)=>props.onChange(e,i+1)}/>            
                    </div>;
                })}
                
                {/* 金銭 */}
                <div id="fare-zone">
                    <TextBox label="運賃" width="90%" value={props.fare} onChange={props.onChangeFare}/>
                </div>
            </div>

            <div className="route-input-right">
                <BlueButton width="100%" value={"縮める"} onClick={(e)=>props.onClickIDButton(e, "D")}/>
                <BlueButton width="100%" value={"伸ばす"} onClick={(e)=>props.onClickIDButton(e, "I")}/>
                <CheckBox label={props.round_trip?"往復":"片道"} onClick={props.onClickRoundTrip} checked={props.round_trip}/>
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


const ReferenceComponent = (props)=>{

    // props.round_trip : boolean (往復かどうか)
    // props.onClickRoundTrip = func(e)
    // props.reference_selected : どのリファレンスが選択されているか（int）    
    // props.reference_list : {
    //  "routeA":"stationA%=%stationB%-%stationC%:%998",
    //  ...
    // props.onClick = func(e, i)
    // }

    // 登録経路を表示用に成形する TODO:for文じゃなくて...
    var table_contents = [];
    for(var alias in props.reference_list){
        var route_fare_set = props.reference_list[alias].split("%:%");
        
        var route = route_fare_set[0].replace(/%=%/g, "=").replace(/%-%/g, "-");
        var fare = route_fare_set[1]+"円";
        
        table_contents.push({"alias":alias, "route":route, "fare":fare});
    }
    
    return (
        <div className="route-reference-container flex-row-center">

            <div className="route-reference-left">
                <ReferenceDisplay table_values={table_contents} onClick={props.onClick} selected={props.reference_selected}/>
                <div style={{marginTop:"40px"}}>※「=」は電車、「-」はバスです。</div>
            </div>

            <div className="route-reference-right">
                <CheckBox label={props.round_trip?"往復":"片道"} onClick={props.onClickRoundTrip} checked={props.round_trip}/>
            </div>
        </div>
    );
}

const RegistrationComponent = (props)=>{

    // props.round_trip : boolean (往復かどうか)
    // props.onClickRoundTrip = func(e)

    var shown_route = "";

    for(var i of [...Array(props.trans_list.length).keys()]){
        shown_route += props.route_list[i];
        shown_route += props.trans_list[i]=="t"?"=":"-";
    }
    shown_route += props.route_list.slice(-1)[0];


    return (
        <div className="flex-column-left">
            
            <h1>登録内容</h1>
            <div>経路： {shown_route}</div>
            <div>金額： {props.fare}円（片道分）</div>
            <div style={{fontSize:"12px"}}>※「=」は電車、「-」はバスです。</div>

            <div className="flex-row-left" style={{marginTop:"40px"}}>
                <TextBox label="登録名" height="37px" value={props.alias} onChange={(e)=>props.onChangeAlias(e)} margin="20px 20px 20px 0px"/>
                <BlueButton value="登録" height="37px" onClick={(e)=>props.onClickRegistration(e)}/>
            </div>
        </div>
    );
}