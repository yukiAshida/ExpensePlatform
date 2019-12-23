import React,{Component} from 'react'
import {BlueButton,RedButton} from './ui_component/button'
import {SelectBox, MultiSelectBox} from './ui_component/select'
import {TextBox, PasswordBox} from './ui_component/text'

// import {role_options, belonging_options} from '../statics/settings'
// import {mail_domain, check_form_signup} from '../statics/settings'
import request from 'superagent'

class RewardsForApplicantPage extends Component{

    constructor(props){
        super(props);
        this.state = {
            "e-mail": props.user_information["e-mail"],
            "first-name": props.user_information["first-name"],
            "last-name": props.user_information["last-name"],
            "reward-code":"",
            "postal-code": "",
            "address": ""
        };
    }

    // 戻るボタンのコールバック
    back(e){
        this.props.alterPhase({ "update":{"page":"root"} });
    }

    apply(e){
        request.post('/rewards_applicant')
        .responseType('arraybuffer')
        .set('Content-Type', 'application/json; charset=utf-8')
        .send(this.state)
        .end(
            (error, res) => {

                if(res.body.byteLength==1){
                    console.log("笑");
                }else{
                                    
                    //.xlsxをバイナリとして取得・ダウンロード
                    var blob = new Blob([ res.body ], { "type" : "text/plain" });
                    let link = document.createElement('a')
                    link.href = window.URL.createObjectURL(blob)
                    link.download = "謝金申請_" + this.state["last-name"]+this.state["first-name"]+".xlsx"
                    link.click()  
                    
                    // 祝日などの確認
                    this.props.alterPhase({ "update":{"page":"root"} });
                }


            }
        );
    }

    onChange(e, label){
        var new_state = Object.assign({},this.state);
        new_state[label] = e.target.value;
        this.setState(new_state);
    }


 

    render(){

        return(
            <div id="rewards_applicant_page" className="flex-column">

                <div className="mycard flex-column-left">
                    <TextBox value={this.state["reward-code"]} label="謝金申請コード" onChange={(e)=>this.onChange(e, "reward-code")}/>
                </div>

                <div className="mycard flex-column-left">
                    <TextBox value={this.state["postal-code"]} label="郵便番号" onChange={(e)=>this.onChange(e, "postal-code")}/>
                </div>

                <div className="mycard flex-column-left">
                    <TextBox value={this.state["address"]} label="住所" onChange={(e)=>this.onChange(e, "address")}/>
                </div>

                <div className="mycard flex-row-left">
                    <BlueButton value="戻る" onClick={(e)=>this.back(e)}/>
                    <BlueButton value="申請" onClick={(e)=>this.apply(e)}/>
                </div>

            </div>
        );
    }
}


export default RewardsForApplicantPage;