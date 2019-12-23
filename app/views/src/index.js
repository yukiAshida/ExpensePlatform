import React,{Component} from 'react'
import ReactDOM from 'react-dom'
import '../statics/css/index.css'
import request from 'superagent'

import LoginPage from './login'
import RootPage from './root'
import SignupPage from './signup'
import UpdatePage from './update'
import PasswordPage from './password'
import AdminPage from './admin'
import TravelExpensePage from './travel_expense'
import RewardsForExperimentorPage from './rewards_experimentor'
import RewardsForApplicantPage from './rewards_applicant'

// import DevelopmentPage from './development'




class IndexPage extends Component{

    constructor(props){

        // Flaskから渡されるパラメータ
        var parameters = {};
        for(var ul of document.getElementById("flask_to_react").children){
            var [parameter_name, parameter_value] = ul.textContent.split(":");
            parameters[parameter_name] = parameter_value;
        }

        // ログインが必要なページ・ユーザー情報が必要なページ
        parameters["LOGIN"] = parameters["LOGIN"].split("/");

        super(props);
        this.state = {
            "page":"",
            "login_next_page":null,
            "parameters":parameters,
            "user_information":{},
            "finance_list":[],
        };
    }

    // 初期化の処理
    componentDidMount(){

        request.post('/index_init').set('Content-Type', 'application/json; charset=utf-8').send({}).end((error, res) => {

            var res_text = JSON.parse(res.text);
            
            // 財源リストを確保してページをrootにする
            var new_state = Object.assign({},this.state);
            new_state["page"] = "root";
            new_state["finance_list"] = res_text["finance_list"];                
            this.setState(new_state);
                
        });
    }

    // トップレベルのページ遷移・データ更新関数
    alterPhase({ update={} }){
        
        // 状態をコピー
        var new_state = Object.assign({},this.state);
        
        // 情報を伝達
        for(var key in update){
            new_state[key] = update[key];
        }

        // 移動先がログイン必要な場合は、遷移を一回送る（ログインページを挟む）
        if(this.state["parameters"]["LOGIN"].includes(new_state["page"]) && this.state["page"]!="login"){
            new_state["login_next_page"] = new_state["page"];
            new_state["page"] = "login";
        }

        // 状態を遷移
        this.setState(new_state);

    }

    render(){

        return(
            <div id="index_page">

                {/* ログイン画面 */}
                {this.state["page"]=="login" && <LoginPage alterPhase={({update})=>this.alterPhase({update})} next_page={this.state["login_next_page"]} />}

                {/* 一番最初のの画面 */}
                {this.state["page"]=="root" && <RootPage alterPhase={({update})=>this.alterPhase({update})} />}

                {/* 登録(サインアップ)画面 */}
                {this.state["page"]=="signup" && <SignupPage alterPhase={({update})=>this.alterPhase({update})} finance_list={this.state["finance_list"]}/>}

                {/* 登録情報更新画面 */}
                {this.state["page"]=="update" && <UpdatePage alterPhase={({update})=>this.alterPhase({update})} user_information={this.state["user_information"]} finance_list={this.state["finance_list"]}/>}
                
                {/* パスワード更新画面 */}
                {this.state["page"]=="password" && <PasswordPage alterPhase={({update})=>this.alterPhase({update})} user_information={this.state["user_information"]}/>}
                
                {/* 管理者画面 */}
                {this.state["page"]=="admin" && <AdminPage alterPhase={({update})=>this.alterPhase({update})} />}

                {/* 近距離旅費申請画面 */}
                {this.state["page"]=="travel_expense" && <TravelExpensePage alterPhase={({update})=>this.alterPhase({update})} user_information={this.state["user_information"]}/>}

                {/* 謝金申請画面 実験者用 */}
                {this.state["page"]=="rewards_experimentor" && <RewardsForExperimentorPage alterPhase={({update})=>this.alterPhase({update})} user_information={this.state["user_information"]}/>}

                {/* 謝金申請画面 実験者用 */}
                {this.state["page"]=="rewards_applicant" && <RewardsForApplicantPage alterPhase={({update})=>this.alterPhase({update})} user_information={this.state["user_information"]}/>}


                {/* 開発ページ */}
                {/* {this.state["page"]=="development" && <DevelopmentPage alterPhase={({update})=>this.alterPhase({update})} />} */}

            </div>
        );
    }
}

ReactDOM.render(
    <IndexPage/>,
    document.getElementById('root')
);