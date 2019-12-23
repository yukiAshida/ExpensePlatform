import React,{Component} from 'react'
import {BlueButton,RedButton} from './ui_component/button'
import {SelectBox, MultiSelectBox} from './ui_component/select'
import {TextBox, PasswordBox} from './ui_component/text'

import {role_options, belonging_options, gender_options} from '../statics/settings'
import {mail_domain, check_form_signup} from '../statics/settings'
import request from 'superagent'

class SignupPage extends Component{

    constructor(props){
        super(props);
        this.state = {
            "last-name":"",
            "first-name":"",
            "role":"",
            "belonging":"",
            "work-code":"",
            "finances":[""],
            "e-mail":"",
            "password":"",
            "password-again":"",

            "last-name-reading":"",
            "first-name-reading":"",
            "gender":"",
            "nationality":"",
            "birthday-year":"",
            "birthday-month":"",
            "birthday-day":"",
            
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
        error_code += (this.state["password"]=="" || this.state["password-again"]=="")?"1":"0";
        error_code += this.state["password"] != this.state["password-again"] ?"1":"0";

        error_code += this.state["last-name-reading"]==""?"1":"0";
        error_code += this.state["first-name-reading"]==""?"1":"0";
        error_code += this.state["gender"]==""?"1":"0";
        error_code += this.state["nationality"]==""?"1":"0";
        error_code += (this.state["birthday-year"]==""||this.state["birthday-month"]==""||this.state["birthday-day"]=="")?"1":"0";

        var error_message = check_form_signup.filter( (v,i)=>{return error_code[i]=="1"} ).join("\n");

        return [error_code.includes("1")?1:0, error_message];
    }

    // 完了ボタンのコールバック
    signup(e){

        var [error_code, error_message] = this.checkForm();
        
        // 入力値に問題があれば警告
        if(error_code==1){
            alert(error_message);
        
        // 問題がなければ、サーバーに送信
        }else{
        
            request.post('/signup').set('Content-Type', 'application/json; charset=utf-8').send(this.state)
                .end((error, res) => {
                    
                    // サーバーからログインチェック判定用変数を取得
                    var res_text = JSON.parse(res.text);
        
                    if(res_text["signup_error"] == 0){
                        alert("登録完了しました")
                        this.props.alterPhase({ "update":{"page":"root"} })
                    }else if(res_text["signup_error"] == 1){
                        alert("このメールアドレスは既に登録されています")
                    }

                }
            );
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



    render(){

        return(
            <div id="signup_page" className="flex-column">

                <div className="mycard flex-column-left">
                    <TextBox margin="20px 20px 5px 20px" value={this.state["last-name"]} label="苗字（last-name）" onChange={(e)=>this.onChange(e, "last-name")}/>
                    <TextBox value={this.state["first-name"]} label="名前（first-name）" onChange={(e)=>this.onChange(e, "first-name")}/>
                    <div className="example"> (例) 東大　太郎　</div>
                </div>

                <div className="mycard flex-column-left">
                    <TextBox margin="20px 20px 5px 20px" value={this.state["last-name-reading"]} label="フリガナ 苗字（last-name）" onChange={(e)=>this.onChange(e, "last-name-reading")}/>
                    <TextBox value={this.state["first-name-reading"]} label="フリガナ 名前（first-name）" onChange={(e)=>this.onChange(e, "first-name-reading")}/>
                    <div className="example"> (例) トウダイ　タロウ</div>
                </div>

                <div className="mycard flex-row-left">
                    <SelectBox onChange={(e)=>{this.onChange(e, "gender")}} label="性別" values={gender_options} selected_value={this.state["gender"]}/>
                </div>
                
                <div className="mycard flex-column-left">
                    <TextBox value={this.state["nationality"]} label="国籍" onChange={(e)=>this.onChange(e, "nationality")}/>
                    <div className="example"> (例) 日本</div>                    
                </div>

                <div className="mycard flex-column-left">
                    <TextBox margin="20px 20px 5px 20px" value={this.state["birthday-year"]} label="生年月日(年)" onChange={(e)=>this.onChange(e, "birthday-year")}/>
                    <TextBox value={this.state["birthday-month"]} label="生年月日（月）" onChange={(e)=>this.onChange(e, "birthday-month")}/>
                    <TextBox value={this.state["birthday-day"]} label="生年月日（日）" onChange={(e)=>this.onChange(e, "birthday-day")}/>
                    <div className="example"> (例) 1996　1　1</div>
                </div>

                <div className="mycard flex-row-left">
                    <SelectBox onChange={(e)=>{this.onChange(e, "role")}} label="役割" values={role_options} selected_value={this.state["role"]}/>
                </div>

                <div className="mycard flex-row-left">
                    <SelectBox onChange={(e)=>{this.onChange(e, "belonging")}} label="所属" values={belonging_options} selected_value={this.state["belonging"]}/>
                </div>

                <div className="mycard flex-column-left">
                    <TextBox value={this.state["work-code"]} label="取引先コード" onChange={(e)=>this.onChange(e, "work-code")}/>
                    <div className="example"> (例) 0000123456</div>
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

                <div className="mycard flex-column-left">
                    <TextBox value={this.state["e-mail"]} label="メールアドレス" onChange={(e)=>this.onChange(e, "e-mail")}/>
                    <div className="example"> (例) xxxxxxx@ドメイン</div>
                </div>

                <div className="mycard flex-row-left">
                    <PasswordBox value={this.state["password"]} label="パスワード" onChange={(e)=>this.onChange(e, "password")}/>
                </div>

                <div className="mycard flex-row-left">
                    <PasswordBox value={this.state["password-again"]} label="パスワード（再）" onChange={(e)=>this.onChange(e, "password-again")}/>
                </div>


                <div className="mycard flex-row-left">
                    <BlueButton value="戻る" onClick={(e)=>this.back(e)}/>
                    <BlueButton value="完了" onClick={(e)=>this.signup(e)}/>
                </div>

            </div>
        );
    }
}


export default SignupPage;