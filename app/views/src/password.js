import React,{Component} from 'react'
import {BlueButton} from './ui_component/button'
import {PasswordBox} from './ui_component/text'
import request from 'superagent'
import {check_form_password} from '../statics/settings'

class PasswordPage extends Component{

    constructor(props){
        super(props);
        this.state = {
            "e-mail":props.user_information["e-mail"],
            "password":"",
            "password-again":""
        };
    }

    onChange(e, label){
        var new_state = Object.assign({},this.state);
        new_state[label] = e.target.value;
        this.setState(new_state);
    }

    // 戻るボタンのコールバックボタン
    back(e){
        this.props.alterPhase({ "update":{"page":"root"} });
    }

    checkForm(){
        
        var error_code = ""
        error_code += (this.state["password"]=="" || this.state["password-again"]=="")?"1":"0";
        error_code += this.state["password"] != this.state["password-again"] ?"1":"0";

        var error_message = check_form_password.filter( (v,i)=>{return error_code[i]=="1"} ).join("\n");

        return [error_code.includes("1")?1:0, error_message];
    }

    // 更新ボタンのコールバック関数
    updatePassword(e, page){

        var [error_code, error_message] = this.checkForm();
        
        // 入力値に問題があれば警告
        if(error_code==1){
            alert(error_message);
        
        // 問題がなければ、サーバーに送信
        }else{

            request.post('/password').set('Content-Type', 'application/json; charset=utf-8').send(this.state).end((error, res) => {
                    
                // サーバーからパスワードエラーチェック判定用変数を取得
                var res_text = JSON.parse(res.text);

                // %%%%% TODO: パスワードエラーチェック %%%%%%%%%%%%%%%%%%%%%
                if(res_text["password_error"] == 0){
                    alert("パスワードを変更しました")
                    this.props.alterPhase( {update:{"page":"root"}} );
                }
                    
            });
        }
    }

    render(){
        

        return(
            <div id="password_page" className="flex-column">
            
                <card className="mycard">
                    <PasswordBox label="新しいパスワード" onChange={(e)=>this.onChange(e, "password")}/>
                    <PasswordBox label="新しいパスワード(再)" onChange={(e)=>this.onChange(e, "password-again")}/>
                </card>

                <card className="mycard">
                    <BlueButton value="戻る" onClick={(e)=>this.back(e)}/>
                    <BlueButton value="ログイン" onClick={(e)=>this.updatePassword(e)}/>
                </card>

            </div>
        );
    }
}


export default PasswordPage;