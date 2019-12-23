import React,{Component} from 'react'
import {BlueButton, RedButton, GreenButton} from './ui_component/button'

class RootPage extends Component{

    constructor(props){
        super(props);
        this.state = {};
    }

    goToPage(e, page){
        this.props.alterPhase({ update:{"page":page} });
    }

    render(){

        var card_width = "35vw";
        var button_width = "30vw";
        var button_height = "60px";
        
        return(
            <div id="root_page" className="flex-row-center">

                <card className="mycard flex-column" id = "root_left_column" style={{width:card_width}}>
                    <BlueButton value="新規登録" onClick={(e)=>this.goToPage(e, "signup")} width={button_width} height={button_height}/>
                    <BlueButton value="登録情報変更" onClick={(e)=>this.goToPage(e, "update")} width={button_width} height={button_height}/>
                    <BlueButton value="パスワード変更" onClick={(e)=>this.goToPage(e, "password")} width={button_width} height={button_height}/>
                    <RedButton value="管理者ページ" onClick={(e)=>this.goToPage(e, "admin")} width={button_width} height={button_height}/>
                    {/* <RedButton value="開発者ページ" onClick={(e)=>this.goToPage(e, "development")} width={button_width} height={button_height}/> */}
                </card>

                <card className="mycard flex-column" id = "root_right_column" style={{width:card_width}}>
                    <GreenButton value="近距離申請" onClick={(e)=>this.goToPage(e, "travel_expense")} width={button_width} height={button_height}/>
                    <GreenButton value="謝金申請 実験者用 (調整中)" onClick={(e)=>this.goToPage(e, "rewards_experimentor")} width={button_width} height={button_height}/>
                    <GreenButton value="謝金申請 申請者用 (調整中)" onClick={(e)=>this.goToPage(e, "rewards_applicant")} width={button_width} height={button_height}/>
                </card>

            </div>
        );
    }
}


export default RootPage;