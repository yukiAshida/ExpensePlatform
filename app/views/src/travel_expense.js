import React,{Component} from 'react'

import {BlueButton} from './ui_component/button'
import {TextBox} from './ui_component/text'
import {SelectBox} from './ui_component/select'

import {MyCalendar} from './main_component/calendar'
import {Locate} from './main_component/locate'
import {Purpose} from './main_component/purpose'
import {Route} from './main_component/routes'
import {RouteDisplay} from './main_component/table'

import request from 'superagent'
import {check_form_travel_expense, check_add_table, check_registration} from '../statics/settings'


class TravelExpensePage extends Component{

    constructor(props){

        super(props);

        // 編集の日時
        var date = new Date();
        var y = date.getFullYear();
        var m = date.getMonth()+1;
        var d = date.getDate();

        // ユーザー情報を取得
        var user_information = Object.assign({}, props.user_information);
        var reference_list_str = props.user_information["reference_list"];
        delete user_information["reference_list"];

        // リファレンスリストを解釈
        var reference_list = {}
        for(var reference of reference_list_str.split(/%:::%/g)){
            
            // 空だとsplitできないため...
            if(reference!=""){
                var [alias, route] = reference.split(/%::%/g);
                reference_list[alias] = route;
            }
        }

        // 財源情報を解釈
        user_information["finances"] = user_information["finances"].split(/%:%/g);

        this.state = {

            "header-info":{
                "year":y,
                "month":m,
                "day":d,
                "finance":""
            },

            "user-info":user_information,

            "route":{
                "route_list":["",""],
                "trans_list":["t"],
                "fare":"",
                "round-trip":true,
                "tab":"input",
                "reference_selected":"",
                "reference_list":reference_list,
                "alias":"",
            },

            "calendar":{
                "year":y,
                "month":m,
                "day":d
            },

            "locate":{
                "select":"",
                "other":"",
            },

            "purpose":{
                "select":""
            },

            "route-display":{
                "data":[],
            }

        };
    }

    // %%%%%%%%% ボトムボタンコールバック用 %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    back(e){
        this.props.alterPhase({ "update":{"page":"root"} });
    }

    checkForm(){
        
        var error_code = ""
        error_code += this.state["header-info"]["finance"]==""?"1":"0";        
        error_code += this.state["route-display"]["data"].length==0?"1":"0";
        
        var error_message = check_form_travel_expense.filter( (v,i)=>{return error_code[i]=="1"} ).join("\n");

        return [error_code.includes("1")?1:0, error_message];
    }

    submitCheck(e){

        request.post('/travel_expense_check').set('Content-Type', 'application/json; charset=utf-8').send(this.state).end((error, res) => {
                
            var res_text = JSON.parse(res.text);
            var comment = res_text["comment"];            
            alert(comment);

            //alert("メール送信時に「経路と金額が記載された画面」のキャプチャ画像を添付してください．")
            this.props.alterPhase({ "update":{"page":"root"} });
                    
        });
    }

    submit(e){
        // [TODO] 警告(後)

        var [error_code, error_message] = this.checkForm();
        
        // 入力値に問題があれば警告
        if(error_code==1){
            alert(error_message);
        
        // 問題がなければ、サーバーに送信
        }else{
        
            request.post('/travel_expense')
            .responseType('arraybuffer')
            .set('Content-Type', 'application/json; charset=utf-8')
            .send(this.state)
            .end(
                (error, res) => {

                    //.xlsxをバイナリとして取得・ダウンロード
                    var blob = new Blob([ res.body ], { "type" : "text/plain" });
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = "近距離旅費_" + this.state["user-info"]["last-name"]+this.state["user-info"]["first-name"] + "_" + this.state["header-info"]["year"] + "年" + this.state["header-info"]["month"] + "月分.xlsm"
                    link.click()  
                    
                    // 祝日などの確認
                    this.submitCheck();
                }
            );
        
        }
    }

    // %%%%%%%%% ユーザー情報用 %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    onChangeDate(e, label){
        var new_state = Object.assign({},this.state);
        new_state["header-info"][label] = e.target.value;
        this.setState(new_state);        
    }

    onChangeFinance(e){
        var new_state = Object.assign({},this.state);
        new_state["header-info"]["finance"] = e.target.value;
        this.setState(new_state);
    }

    // %%%%%%%%% calendarコンポーネント用 %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    onChangeCalendar(e){
        
        e._isUTC = false;
        
        var new_state = Object.assign({},this.state);
        new_state["calendar"]["year"] = e._d.getFullYear();
        new_state["calendar"]["month"] = e._d.getMonth()+1;
        new_state["calendar"]["day"] = e._d.getDate();

        this.setState(new_state);
    }

    // %%%%%%%%% locateコンポーネント用 %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    onChangeLocate(e, label){
        var new_state = Object.assign({},this.state);
        new_state["locate"][label] = e.target.value;
        this.setState(new_state);
    }

    // %%%%%%%%% purposeコンポーネント用 %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    onChangePurpose(e){
        var new_state = Object.assign({},this.state);
        new_state["purpose"]["select"] = e.target.value;
        this.setState(new_state);
    }

    // %%%%%%%%% routeコンポーネント用 %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

    // i番目(int)のwhich("T" or "B")の矢印をクリック
    onClickRouteArrow(e, which, i){

        var new_state = Object.assign({},this.state);
        new_state["route"]["trans_list"][i] = which;
        this.setState(new_state);

    }

    // 往復ボタンをクリック(見た目の挙動はCSSで制御(やめたい))
    onClickRoundTrip(e){
        var new_state = Object.assign({},this.state);
        new_state["route"]["round-trip"] = Boolean(new_state["route"]["round-trip"]-1)
        this.setState(new_state);
    }

    // label("I"or"D")のボタンをクリック
    onClickRouteIDButton(e, label){
        var new_state = Object.assign({},this.state);
        
        if(label=="I"){
            new_state["route"]["route_list"].push("");
            new_state["route"]["trans_list"].push("t"); 
        }else if(label=="D" && this.state["route"]["route_list"].length>2){
            new_state["route"]["route_list"].pop();
            new_state["route"]["trans_list"].pop();
        }
        
        this.setState(new_state);
    }

    // i番目(int)のルートを変更
    onChangeRoute(e, i){
        var new_state = Object.assign({},this.state);
        new_state["route"]["route_list"][i] = e.target.value;
        this.setState(new_state);
    }

    // 金額変更に対するコールバック関数
    onChangeFare(e){
        var new_state = Object.assign({},this.state);
        new_state["route"]["fare"] = e.target.value;
        this.setState(new_state);
    }

    // i番目(int)のリファレンスをクリック
    onClickRouteReference(e, alias){
        var new_state = Object.assign({},this.state);
        new_state["route"]["reference_selected"] = alias;
        this.setState(new_state);
    }

    // which("input" or "reference")のタブを選択
    onClickTab(e, which){
        var new_state = Object.assign({},this.state);
        new_state["route"]["tab"] = which;
        this.setState(new_state);
    }

    onChangeAlias(e){
        var new_state = Object.assign({},this.state);
        new_state["route"]["alias"] = e.target.value;
        this.setState(new_state);
    }

    checkRegistration(){

        var error_code = ""
        error_code += this.state["route"]["alias"]==""?"1":"0";
        error_code += this.state["route"]["fare"]==""?"1":"0";
        error_code += this.state["route"]["fare"].match(/^\d*$/g)==null?"1":"0";
        error_code += this.state["route"]["route_list"].includes("")?"1":"0";

        
        var error_message = check_registration.filter( (v,i)=>{return error_code[i]=="1"} ).join("\n");

        return [error_code.includes("1")?1:0, error_message];
    }

    alertRegistrationMessage(){

        var shown_route = "";

        for(var i of [...Array(this.state["route"]["trans_list"].length).keys()]){
            shown_route += this.state["route"]["trans_list"][i];
            shown_route += this.state["route"]["trans_list"][i]=="t"?"=":"-";
        }

        shown_route += this.state["route"]["route_list"].slice(-1)[0];
        
        var message = `以下の内容で登録しました
        ----------------------
        エイリアス : ${this.state["route"]["alias"]}
        経路の内容 : ${shown_route}
        金額 : ${this.state["route"]["fare"]}円です.`;

        alert(message);
    }

    onClickRegistration(e){

        var [error_code, error_message] = this.checkRegistration();
        
        // 入力値に問題があれば警告
        if(error_code==1){
            alert(error_message);
        
        // 問題がなければ、テーブルに追加
        }else{

            request.post('/registration').set('Content-Type', 'application/json; charset=utf-8').send(this.state).end((error, res) => {
                
                var res_text = JSON.parse(res.text);

                if(res_text["registration_error"] == 0){
                    
                    // 登録内容を通知
                    this.alertRegistrationMessage();

                    var new_state = Object.assign({},this.state);
                    new_state["route"]["reference_list"][res_text["alias"]] = res_text["route_trans"] + "%:%" + res_text["fare"];
                    new_state["route"]["alias"] = "";
                    this.setState(new_state);
                    
                }else if(res_text["registration_error"] == 1){
                    alert("登録数が限度に達しています")
                }
                
            });
        }

    }
    
    // %%%%%%%%% テーブル追加・削除用 %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    
    checkAddTable(){

        var error_code = ""
        error_code += this.state["locate"]["select"]==""?"1":"0";
        error_code += this.state["locate"]["select"]=="その他"&&this.state["locate"]["other"]==""?"1":"0";
        error_code += this.state["purpose"]["select"]==""?"1":"0";
        error_code += this.state["route"]["tab"]=="input"&&this.state["route"]["fare"]==""?"1":"0";
        error_code += this.state["route"]["tab"]=="input"&& this.state["route"]["fare"].match(/^\d*$/g)==null?"1":"0";
        error_code += this.state["route"]["tab"]=="input"&&this.state["route"]["route_list"].includes("")?"1":"0";
        error_code += this.state["route"]["tab"]=="reference"&&this.state["route"]["reference_selected"]==""?"1":"0";
        error_code += this.state["route"]["tab"]=="registration"?"1":"0";

        var error_message = check_add_table.filter( (v,i)=>{return error_code[i]=="1"} ).join("\n");

        return [error_code.includes("1")?1:0, error_message];
    }
    
    onClickAdd(e){
        
        var [error_code, error_message] = this.checkAddTable();
        
        // 入力値に問題があれば警告
        if(error_code==1){
            alert(error_message);
        
        // 問題がなければ、テーブルに追加
        }else{

            var new_state = Object.assign({},this.state);

            // テーブルに追加するデータを作成（共通項目）
            var row_data = {
                "date":this.state["calendar"]["year"] + "/" + this.state["calendar"]["month"] + "/" + this.state["calendar"]["day"], 
                "locate":this.state["locate"]["select"]=="その他"?this.state["locate"]["other"]:this.state["locate"]["select"],
                "purpose":this.state["purpose"]["select"],
            }

            // タブがinputの場合
            if(this.state["route"]["tab"]=="input"){

                // 運賃と経路（初期値）
                row_data["fare"] = this.state["route"]["round-trip"]? (parseInt(this.state["route"]["fare"])*2).toString() + "円(往復)":this.state["route"]["fare"]+"円(片道)";
                row_data["route"] = "";

                // 現在入力されている経路情報を追加
                for(var i of [...Array(this.state["route"]["trans_list"].length).keys()]){
                    row_data["route"] += this.state["route"]["route_list"][i];
                    row_data["route"] += this.state["route"]["trans_list"][i]=="t"?"%=%":"%-%";
                }
                row_data["route"] += this.state["route"]["route_list"].slice(-1)[0];
                
                // データをテーブルに流し込む
                new_state["route-display"]["data"].push(row_data);
                
            // タブがreferenceの場合
            }else if(this.state["route"]["tab"]=="reference"){

                var selected = this.state["route"]["reference_selected"]

                var route_fare_set = this.state["route"]["reference_list"][selected];
                var [route, fare] = route_fare_set.split("%:%");
                

                row_data["route"] = route;
                row_data["fare"] = this.state["route"]["round-trip"]? (parseInt(fare)*2).toString() + "円(往復)":fare+"円(片道)"
                
                // データをテーブルに流し込む
                new_state["route-display"]["data"].push(row_data);

            }

            // 日付順にソート
            new_state["route-display"]["data"].sort(function(a,b){

                var alist = a["date"].split('/');
                var blist = b["date"].split('/');
          

                // 西暦->月->日の順に大小関係を比較
                for (var i=0; i<3; i++){
                    var diff = parseInt(alist[i]) - parseInt(blist[i]);   
                    
                    if(diff!=0){
                        return diff>0 ? 1 : -1;
                    }
                }

                return 0
            
            });

            this.setState(new_state);

        }
    }

    onClickDelete(e, i){

        var new_state = Object.assign({},this.state);

        // データをテーブルに流し込む
        new_state["route-display"]["data"].splice(i,1);
        
        this.setState(new_state);
    }

    render(){

        return(
            <div id="travel_expense_page">

                <div className="mycard flex-column-left" style={{width:"auto", marginBottom:"50px"}}>

                    <TextBox label="何年分" value={this.state["header-info"]["year"]} onChange={(e)=>this.onChangeDate(e, "year")}/>
                    <TextBox label="何月分" value={this.state["header-info"]["month"]} onChange={(e)=>this.onChangeDate(e, "month")}/>
                    <SelectBox label="財源" values={this.state["user-info"]["finances"]} onChange={(e)=>this.onChangeFinance(e)} selected_value={this.state["header-info"]["finance"]}/>
                                    
                </div>

                {/* 「カレンダー類」と「経路UI」を横に並べるためのボックス */}
                <div className="flex-row-center">

                    {/* 「カレンダー・目的・用務先」と「登録表」を縦に並べるためのボックス */}
                    <div className="flex-column" style={{width:"50%"}}>

                        {/* 「カレンダー」と「目的・用務先」を横に並べるためのボックス */}
                        <div className="mycard flex-row-center" style={{width:"100%", height:"500px", padding:"20px"}} >
                            
                            {/* カレンダー */}
                            <div className="flex-column" style={{width:"45%"}}>
                                <MyCalendar state={this.state["calendar"]} onChange={(e)=>this.onChangeCalendar(e)}/>
                                <BlueButton value="追加" onClick={(e)=>this.onClickAdd(e)}/>
                            </div>

                            {/* 目的・用務先 */}
                            <div className="flex-column" style={{width:"45%"}}>
                                <Locate width="100%" state={this.state["locate"]} onChange={(e,label)=>this.onChangeLocate(e, label)} selected_value={this.state["locate"]["select"]}/>
                                <Purpose width="100%" state={this.state["purpose"]} onChange={(e)=>this.onChangePurpose(e)} selected_value={this.state["purpose"]["select"]}/>
                            </div>
                        
                        </div>

                        {/* 登録表 */}
                        <div className="mycard" style={{width:"100%", padding:"20px"}}>
                            <RouteDisplay state={this.state["route-display"]} onClickDelete={(e,i)=>this.onClickDelete(e,i)}/>
                        </div>
                    
                    </div>

                    {/* 経路UI用のボックス */}
                    <div className="mycard flex-row-center" style={{width:"40%", height:"min-content", padding:"20px"}}>
                        <Route 
                            width="90%" 
                            state={this.state["route"]} 
                            onClickArrow={(e, which, i)=>this.onClickRouteArrow(e, which, i)} 
                            onClickRoundTrip={(e)=>this.onClickRoundTrip(e)} 
                            onClickReference={(e, i)=>this.onClickRouteReference(e, i)} 
                            onClickIDButton={(e,label)=>this.onClickRouteIDButton(e, label)} 
                            onChange={(e,i)=>this.onChangeRoute(e,i)} onChangeFare={(e)=>this.onChangeFare(e)} 
                            onClickTab={(e,which)=>this.onClickTab(e,which)}
                            onClickRegistration={(e)=>this.onClickRegistration(e)}
                            onChangeAlias={(e)=>this.onChangeAlias(e)}
                        />
                    </div>

                </div>

                {/* 戻る・提出ボタン */}
                <card className="mycard">
                    <BlueButton value="戻る" onClick={(e)=>this.back(e)}/>
                    <BlueButton value="作成" onClick={(e)=>this.submit(e)}/>
                </card>

            </div>
        );
    }
}


export default TravelExpensePage;