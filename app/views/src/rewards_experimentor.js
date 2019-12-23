import React,{Component} from 'react'
import {BlueButton,RedButton} from './ui_component/button'
import {SelectBox, MultiSelectBox} from './ui_component/select'
import {TextBox, PasswordBox} from './ui_component/text'

import request from 'superagent'

class RewardsForExperimentorPage extends Component{

    constructor(props){
        super(props);
        this.state = {
            "e-mail": props.user_information["e-mail"],
            "work-content":"",
            "term-start-year":"",
            "term-start-month":"",
            "term-start-day":"",
            "term-end-year":"",
            "term-end-month":"",
            "term-end-day":"",
            "hours":"",
            "location":"",   
        };
    }

    // 戻るボタンのコールバック
    back(e){
        this.props.alterPhase({ "update":{"page":"root"} });
    }

    apply(e){
        
        request.post('/rewards_experimentor').set('Content-Type', 'application/json; charset=utf-8').send(this.state)
            .end((error, res) => {
                
                // サーバーからログインチェック判定用変数を取得
                var res_text = JSON.parse(res.text);
    
                if(res_text["rewards_experimentor_error"] == 0){

                    var blob = new Blob([ res_text["reward-code"] ], { "type" : "text/plain" });
                    let link = document.createElement('a');
                    link.href = window.URL.createObjectURL(blob)
                    link.download = "謝金申請コード.txt";
                    link.click();

                    alert(`申請しました
                    ---------------
                    謝金申請コードは ${res_text["reward-code"]} です
                    `);
                    
                    this.props.alterPhase({ "update":{"page":"root"} })

                }else if(res_text["rewards_applicant_error"] == 1){
                    alert("メールアドレスが登録されていません")
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
            <div id="rewards_experimentor_page" className="flex-column">

                <div className="mycard flex-column-left">
                    <TextBox value={this.state["work-content"]} label="仕事の内容" onChange={(e)=>this.onChange(e, "work-content")}/>
                </div>

                <div className="mycard flex-column-left">
                    <div className="flex-row-left">
                        <TextBox value={this.state["term-start-year"]} label="実施期間 開始予定(年)" onChange={(e)=>this.onChange(e, "term-start-year")}/>
                        <TextBox value={this.state["term-start-month"]} label="実施期間 開始予定(月)" onChange={(e)=>this.onChange(e, "term-start-month")}/>
                        <TextBox value={this.state["term-start-day"]} label="実施期間 開始予定(日)" onChange={(e)=>this.onChange(e, "term-start-day")}/>                        
                    </div>
                </div>

                <div className="mycard flex-column-left">
                    <div className="flex-row-left">
                        <TextBox value={this.state["term-end-year"]} label="実施期間 終了予定(年)" onChange={(e)=>this.onChange(e, "term-end-year")}/>
                        <TextBox value={this.state["term-end-month"]} label="実施期間 終了予定(月)" onChange={(e)=>this.onChange(e, "term-end-month")}/>
                        <TextBox value={this.state["term-end-day"]} label="実施期間 終了予定(日)" onChange={(e)=>this.onChange(e, "term-end-day")}/>                        
                    </div>
                </div>

                <div className="mycard flex-column-left">
                    <TextBox value={this.state["hours"]} label="一人につき予定している実験時間" onChange={(e)=>this.onChange(e, "hours")}/>
                </div>

                <div className="mycard flex-column-left">
                    <TextBox value={this.state["location"]} label="実施予定場所" onChange={(e)=>this.onChange(e, "location")}/>
                </div>

                <div className="mycard flex-row-left">
                    <BlueButton value="戻る" onClick={(e)=>this.back(e)}/>
                    <BlueButton value="申請" onClick={(e)=>this.apply(e)}/>
                </div>

            </div>
        );
    }
}


export default RewardsForExperimentorPage;