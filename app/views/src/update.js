import React,{Component} from 'react'
import {BlueButton,RedButton} from './ui_component/button'
import {SelectBox, MultiSelectBox} from './ui_component/select'
import {TextBox} from './ui_component/text'
import {ReferenceEditor} from './main_component/reference_editor'
import request from 'superagent'
import {mail_domain, check_form_update, check_form_reference_update} from '../statics/settings'
import {role_options, belonging_options, gender_options} from '../statics/settings'

class UpdatePage extends Component{

    constructor(props){

        // リファレンスリストを解釈
        var reference_list = {}
        for(var reference of props.user_information["reference_list"].split(/%:::%/g)){
            
            // 空だとsplitできないため...
            if(reference!=""){
                var [alias, route] = reference.split(/%::%/g);
                reference_list[alias] = route;
            }

        }

        // 外しておk
        var birth_y,birth_m,birth_d;
        if(props.user_information["birthday"]!=null){
            [birth_y,birth_m,birth_d] = props.user_information["birthday"].split("/");
        }else{
            [birth_y,birth_m,birth_d] = ["","",""]
        }

        super(props);
        this.state = {
            "last-name":props.user_information["last-name"],
            "first-name":props.user_information["first-name"],
            "role":props.user_information["role"],
            "belonging":props.user_information["belonging"],
            "work-code":props.user_information["work-code"],
            "finances":props.user_information["finances"].split("%:%"),
            "e-mail":props.user_information["e-mail"],
            "original-e-mail":props.user_information["e-mail"],
            "reference_selected":"",
            "reference_list":reference_list,
            "reference_information":{
                "route_list":["",""],
                "trans_list":["b"],
                "fare":"",
                "alias":""
            },

            "last-name-reading":props.user_information["last-name-reading"],
            "first-name-reading":props.user_information["first-name-reading"],
            "gender":props.user_information["gender"],
            "nationality":props.user_information["nationality"],
            "birthday-year":birth_y,
            "birthday-month":birth_m,
            "birthday-day":birth_d,

        };

    }


    // 戻るボタンのコールバック
    back(e){
        this.props.alterPhase({ "update":{"page":"root"} });
    }

    checkForm(){
        
        var error_code = ""
        error_code += this.state["last-name"]==""?"1":"0";
        error_code += this.state["first-name"]==""?"1":"0";
        error_code += this.state["role"]==""?"1":"0";
        error_code += this.state["belonging"]==""?"1":"0";
        error_code += this.state["work-code"]==""?"1":"0";
        error_code += this.state["finances"][0]==""?"1":"0";
        error_code += this.state["e-mail"]==""?"1":"0";
        
        var domain_check = 0
        for(var domain of mail_domain){
            domain_check += ((this.state["e-mail"].lastIndexOf(domain)+domain.length)===this.state["e-mail"].length)&&(domain.length<=this.state["e-mail"].length)?1:0;
        }

        error_code += domain_check==0?"1":"0";

        error_code += this.state["last-name-reading"]==""?"1":"0";
        error_code += this.state["first-name-reading"]==""?"1":"0";
        error_code += this.state["gender"]==""?"1":"0";
        error_code += this.state["nationality"]==""?"1":"0";
        error_code += (this.state["birthday-year"]==""||this.state["birthday-month"]==""||this.state["birthday-day"]=="")?"1":"0";

        var error_message = check_form_update.filter( (v,i)=>{return error_code[i]=="1"} ).join("\n");

        return [error_code.includes("1")?1:0, error_message];
    }

    // 完了ボタンのコールバック
    update(e){

        var [error_code, error_message] = this.checkForm();
        
        // 入力値に問題があれば警告
        if(error_code==1){
            alert(error_message);
        
        // 問題がなければ、サーバーに送信
        }else{
        
            // サーバーに登録情報を送信
            request.post('/update').set('Content-Type', 'application/json; charset=utf-8').send(this.state).end((error, res) => {
                    
                // サーバーからログインチェック判定用変数を取得
                var res_text = JSON.parse(res.text);

                if(res_text["update_error"] == 0){
                    alert("更新完了しました")
                    this.props.alterPhase({ "update":{"page":"root"} })
                }else if(res_text["update_error"] == 1){
                    alert("そのメールアドレスは既に登録されています")
                }

            });
        }
    }

    // テキスト・パスワードボックスのコールバック
    onChange(e, label){
        
        var new_state = Object.assign({},this.state);
        new_state[label] = e.target.value;
        this.setState(new_state);
    }

    // マルチセレクタのコールバック
    onClickSelectorButton(e, label, pop_or_push){

        var new_state = Object.assign({},this.state);

        // 状態を遷移
        if(pop_or_push=="pop" && this.state[label].length > 1){
            new_state[label].pop();
        }else if(pop_or_push=="push"){
            new_state[label].push("");
        }

        this.setState(new_state);
    }

    onMultiChange(e, label, i){
        var new_state = Object.assign({},this.state);
        new_state[label][i] = e.target.value;
        this.setState(new_state);
    }

    // %%%%%%%%%%% ReferenceEditor用 %%%%%%%%%%%%%%%%%%%%%%%
    // %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
    
    checkReferenceUpdate(){
        
        // エイリアスを変更して、かつ他のエイリアスと重なるかどうかチェック
        var b_change = this.state["reference_selected"] != this.state["reference_information"]["alias"];
        var b_duplication = this.state["reference_list"].hasOwnProperty(this.state["reference_information"]["alias"]);
        
        var error_code = ""
        error_code += (b_change && b_duplication)?"1":"0";        
        error_code += this.state["reference_information"]["alias"]==""?"1":"0";
        error_code += this.state["reference_information"]["fare"]==""?"1":"0";
        error_code += this.state["reference_information"]["route_list"].includes("")?"1":"0";
        
        var error_message = check_form_reference_update.filter( (v,i)=>{return error_code[i]=="1"} ).join("\n");

        return [error_code.includes("1")?1:0, error_message];
    }

    onClickDeleteReference(e){
        var new_state = Object.assign({},this.state);
        delete new_state["reference_list"][this.state["reference_selected"]];
        new_state["reference_selected"] = "";
        this.setState(new_state);
    }

    

    onClickUpdateReference(e){
        
        var [error_code, error_message] = this.checkReferenceUpdate();
        
        // 入力値に問題があれば警告
        if(error_code==1){
            alert(error_message);
        
        // 問題がなければ、登録経路を更新
        }else{
            var new_state = Object.assign({},this.state);
            var selected = this.state["reference_selected"];
            var new_route = [this.state["reference_information"]["route_list"][0],];

            // 駅名＋移動手段を交互に追加
            for(var i of [...Array(this.state["reference_information"]["trans_list"].length).keys()]){
                new_route.push(this.state["reference_information"]["trans_list"][i]=="t"?"%=%":"%-%",this.state["reference_information"]["route_list"][i+1])
            }
            
            // 運賃情報を追加
            new_route.push("%:%", this.state["reference_information"]["fare"])
            
            // 古いエイリアスを消して、新規情報を追加（エイリアスに変更が無い場合も一回消去）
            delete new_state["reference_list"][selected]
            new_state["reference_list"][this.state["reference_information"]["alias"]] = new_route.join("");

            // 更新したら選択を解除
            new_state["reference_selected"] = this.state["reference_information"]["alias"];

            this.setState(new_state);
        }

    }

    onClickReferenceTable(e, alias){
        var new_state = Object.assign({},this.state);

        if(this.state["reference_selected"]==alias){
            new_state["reference_selected"]="";
        }else{
            new_state["reference_selected"]=alias;

            var [route, fare] = this.state["reference_list"][alias].split(/%:%/g);
            
            new_state["reference_information"]["route_list"] = route.split(/%.%/g);
            new_state["reference_information"]["trans_list"] = [...route.matchAll(/%.%/g)].map( (e)=> e[0]=="%=%"?"t":"b" );
            new_state["reference_information"]["fare"] = fare;
            new_state["reference_information"]["alias"] = alias;
        }

        this.setState(new_state);
    }

    // i番目(int)のwhich("T" or "B")の矢印をクリック
    onClickArrow(e, which, i){

        var new_state = Object.assign({},this.state);
        new_state["reference_information"]["trans_list"][i] = which;
        this.setState(new_state);

    }

    // label("I"or"D")のボタンをクリック
    onClickIDButton(e, label){
        var new_state = Object.assign({},this.state);
        
        if(label=="I"){
            new_state["reference_information"]["route_list"].push("");
            new_state["reference_information"]["trans_list"].push("t"); 
        }else if(label=="D" && this.state["reference_information"]["route_list"].length>2){
            new_state["reference_information"]["route_list"].pop();
            new_state["reference_information"]["trans_list"].pop();
        }
        
        this.setState(new_state);
    }

    // i番目(int)のルートを変更
    onChangeRoute(e, i){
        var new_state = Object.assign({},this.state);
        new_state["reference_information"]["route_list"][i] = e.target.value;
        this.setState(new_state);
    }

    // 金額変更に対するコールバック関数
    onChangeFare(e){
        var new_state = Object.assign({},this.state);
        new_state["reference_information"]["fare"] = e.target.value;
        this.setState(new_state);
    }

    onChangeAlias(e){
        var new_state = Object.assign({},this.state);
        new_state["reference_information"]["alias"] = e.target.value;
        this.setState(new_state);
    }



    render(){

        return(
            <div id="signup_page" className="flex-column">

                <div className="mycard flex-column-left">
                    <TextBox margin="20px 20px 5px 20px" value={this.state["last-name"]} label="苗字（last-name）" onChange={(e)=>this.onChange(e, "last-name")}/>
                    <TextBox value={this.state["first-name"]} label="名前（first-name）" onChange={(e)=>this.onChange(e, "first-name")}/>
                </div>
                
                <div className="mycard flex-column-left">
                    <TextBox margin="20px 20px 5px 20px" value={this.state["last-name-reading"]} label="フリガナ 苗字（last-name）" onChange={(e)=>this.onChange(e, "last-name-reading")}/>
                    <TextBox value={this.state["first-name-reading"]} label="フリガナ 名前（first-name）" onChange={(e)=>this.onChange(e, "first-name-reading")}/>
                </div>

                <div className="mycard flex-row-left">
                    <SelectBox onChange={(e)=>{this.onChange(e, "gender")}} label="性別" values={gender_options} selected_value={this.state["gender"]}/>
                </div>
                
                <div className="mycard flex-row-left">
                    <TextBox value={this.state["nationality"]} label="国籍" onChange={(e)=>this.onChange(e, "nationality")}/>
                </div>

                <div className="mycard flex-column-left">
                    <TextBox margin="20px 20px 5px 20px" value={this.state["birthday-year"]} label="生年月日(年)" onChange={(e)=>this.onChange(e, "birthday-year")}/>
                    <TextBox value={this.state["birthday-month"]} label="生年月日（月）" onChange={(e)=>this.onChange(e, "birthday-month")}/>
                    <TextBox value={this.state["birthday-day"]} label="生年月日（日）" onChange={(e)=>this.onChange(e, "birthday-day")}/>                
                </div>

                <div className="mycard flex-row-left">
                    <SelectBox onChange={(e)=>{this.onChange(e, "role")}} label="役割" values={role_options} selected_value={this.state["role"]}/>
                </div>

                <div className="mycard flex-row-left">
                    <SelectBox onChange={(e)=>{this.onChange(e, "belonging")}} label="所属" values={belonging_options} selected_value={this.state["belonging"]}/>
                </div>

                <div className="mycard flex-row-left">
                    <TextBox value={this.state["work-code"]} label="取引先コード" onChange={(e)=>this.onChange(e, "work-code")}/>
                </div>

                <div className="mycard flex-row-left">
                    <MultiSelectBox 
                        onChange={(e, i)=>{this.onMultiChange(e, "finances", i)}} 
                        onClick={(e, pop_or_push)=>this.onClickSelectorButton(e, "finances", pop_or_push)}
                        label = "財源"
                        values={this.props.finance_list} 
                        selected_values={this.state["finances"]}
                    />
                </div>

                <div className="mycard flex-row-left">
                    <TextBox value={this.state["e-mail"]} label="メールアドレス" onChange={(e)=>this.onChange(e, "e-mail")}/>
                </div>

                <div className="mycard flex-row-left">
                    <ReferenceEditor 
                        reference_list={this.state["reference_list"]} 
                        reference_selected={this.state["reference_selected"]}
                        reference_information={this.state["reference_information"]}
                        
                        onClickDeleteReference={(e, selected)=>this.onClickDeleteReference(e, selected)}
                        onClickUpdateReference={(e, state)=>this.onClickUpdateReference(e, state)}
                        onClickReferenceTable={(e,alias)=>this.onClickReferenceTable(e,alias)}

                        onClickArrow={(e,which,i)=>this.onClickArrow(e,which,i)}
                        onChangeRoute={(e,i)=>this.onChangeRoute(e,i)}
                        onChangeFare={(e)=>this.onChangeFare(e)}
                        onChangeAlias={(e)=>this.onChangeAlias(e)}
                        onClickIDButton = {(e,label)=>this.onClickIDButton(e,label)}

                    />
                </div>


                <div className="mycard flex-row-left">
                    <BlueButton value="戻る" onClick={(e)=>this.back(e)}/>
                    <BlueButton value="更新" onClick={(e)=>this.update(e)}/>
                </div>

            </div>
        );
    }
}


export default UpdatePage;