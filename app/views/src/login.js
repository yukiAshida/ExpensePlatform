import React,{Component} from 'react'
import {BlueButton} from './ui_component/button'
import {TextBox,PasswordBox} from './ui_component/text'
import request from 'superagent'
import {check_form_login} from '../statics/settings'

class LoginPage extends Component{

    // props.next_page = 入れた場合に進めるページ
    constructor(props){
        super(props);
        this.state = {
            "e-mail":"",
            "password":"",
            "next-page":props.next_page
        };
    }

    onChange(e, label){
        var new_state = Object.assign({},this.state);
        new_state[label] = e.target.value;
        this.setState(new_state);
    }

    // 戻るページ
    back(e, page){
        this.props.alterPhase( {update:{"page":"root"}} );
    }

    checkForm(){

        var error_code = "";
        error_code += this.state["e-mail"]==""?"1":"0";
        error_code += this.state["password"]==""?"1":"0";
        
        var error_message = check_form_login.filter( (v,i)=>{return error_code[i]=="1"} ).join("\n");

        return [error_code.includes("1")?1:0, error_message];
    }

    // ログインボタンのコールバック関数
    login(e, page){

        var [error_code, error_message] = this.checkForm();
        
        // 入力値に問題があれば警告
        if(error_code==1){
            alert(error_message);
        
        // 問題がなければ、サーバーに送信
        }else{
        
            request.post('/login').set('Content-Type', 'application/json; charset=utf-8').send(this.state).end((error, res) => {
                    
                // サーバーからログインチェック判定用変数を取得
                var res_text = JSON.parse(res.text);

                if(res_text["login_error"] == 0){
                    this.props.alterPhase({ update:{"page":this.props.next_page, "user_information":res_text["user_information"]} });
                }else if(res_text["login_error"] == 1){
                    alert("メールアドレスが登録されていません");
                }else if(res_text["login_error"] == 2){
                    alert("パスワードが間違っています");
                }else if(res_text["login_error"] == 3){
                    alert("管理者権限がありません");
                }else if(res_text["login_error"] == 4){
                    alert("アカウント名かパスワードのいずれかが間違っています");
                }
            });
        
        }
    }

    render(){
        
        return(
            <div id="login_page" className="flex-column">

                <div className="mycard login_form_card">
                    <form>
                        <TextBox label="メールアドレス" value={this.state["e-mail"]} onChange={(e)=>this.onChange(e, "e-mail")}/>
                        <PasswordBox label="パスワード" value={this.state["password"]} onChange={(e)=>this.onChange(e, "password")}/>
                    </form>
                </div>

                <card className="mycard login_button_card">
                    <BlueButton value="戻る" onClick={(e)=>this.back(e)}/>
                    <BlueButton value="ログイン" onClick={(e)=>this.login(e)}/>
                </card>

            </div>
        );
    }
}


export default LoginPage;