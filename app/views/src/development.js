import React,{Component} from 'react'
import {BlueButton} from './ui_component/button'
import request from 'superagent';

class DevelopmentPage extends Component{

    constructor(props){
        super(props);
        this.state = {};
    }

    goToPage(e, page){
        this.props.alterPhase({ "update":{"page":page} });
    }

    onClick(e, kind){

        request.post('/development').set('Content-Type', 'application/json; charset=utf-8').send({button:kind}).end((error, res) => {
                    
            // サーバーからログインチェック判定用変数を取得
            var res_text = JSON.parse(res.text);

        });
    }

    render(){
        
        return(
            <div id="admin_page">

                <card className="mycard">
                    <BlueButton value="1" onClick={(e)=>this.onClick(e, "1")}/>
                    <BlueButton value="2" onClick={(e)=>this.onClick(e, "2")}/>
                    <BlueButton value="3" onClick={(e)=>this.onClick(e, "3")}/>
                </card>

                <card className="mycard">
                    <BlueButton value="戻る" onClick={(e)=>this.goToPage(e, "root")}/>
                </card>

            </div>
        );
    }
}


export default DevelopmentPage;