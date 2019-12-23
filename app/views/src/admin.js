import React,{Component} from 'react'
import {BlueButton} from './ui_component/button'
import {TextBox} from './ui_component/text'
import {FinanceUploader} from './main_component/finance_uploader'
import request from 'superagent'
import {HolidaysTable, CacheTable} from './main_component/table'

class AdminPage extends Component{

    
    constructor(props){
        super(props);
        this.state = {
            "uploaded_finance":{},
            "upload_filename":"",
            "delete_e-mail":"",
            "admin_e-mail":"",

            "holidays-addition-year":"",
            "holidays-addition-month":"",
            "holidays-addition-day":"",
            "holidays-addition-content":"",
            
            "holidays-table-year":"",
            "holidays-table":[],

            "cache-table":[],
        };
    }

    back(e){
        this.props.alterPhase({ "update":{"page":"root"} });
    }

    onChange(e, label){
    
        var new_state = Object.assign({},this.state);
        new_state[label] = e.target.value;
        this.setState(new_state);
    }

    // %%%%%%%%%%%%% 財源アップロード用 %%%%%%%%%%%%%%%%%%%%%%%%%%%%
    onUpload(result, filename){
        var new_state = Object.assign({},this.state);
        new_state["uploaded_finance"] = result;
        new_state["upload_filename"] = filename;
        this.setState(new_state);
    }

    onClickUpload(e){

        if(this.state["upload_filename"]==""){
            alert("ファイルをアップロードしてください")
        }else{

            request.post('/admin_finance')
            .set('Content-Type', 'application/json; charset=utf-8')
            .send(this.state)
            .end(
                (error, res) => {
                    var res_text = JSON.parse(res.text);
                    alert(res_text.comment);
                }
            );

        }
    }

    // %%%%%%%%%%%%% 雑多な管理者処理用 %%%%%%%%%%%%%%%%%%%%%%%%%%%%
    onAdminProcess(e, mode){

        var send_data = Object.assign({}, this.state);
        send_data["mode"] = mode;

        request.post('/admin_process').set('Content-Type', 'application/json; charset=utf-8').send(send_data).end(
            (error, res) => {
                var res_text = JSON.parse(res.text);
                alert(res_text["comment"]);

                if(mode=="holidays-addition"){
                    var new_state = Object.assign({},this.state);
                    new_state["holidays-addition-year"] = "";
                    new_state["holidays-addition-month"] = "";
                    new_state["holidays-addition-day"] = "";
                    new_state["holidays-addition-content"] = "";
                    this.setState(new_state);
                }

            }
        );

    }

    // %%%%%%%%%%%%%%%% テーブル表示・削除用 %%%%%%%%%%%%%%%%%%%%%
    onAdminList(e, label){

        var send_data = Object.assign({}, this.state);
        send_data["label"] = label;
        send_data["type"] = "show";
        

        request.post('/admin_list').set('Content-Type', 'application/json; charset=utf-8').send(send_data).end(
            (error, res) => {

                var res_text = JSON.parse(res.text);

                var new_state = Object.assign({},this.state);
                new_state[label] = res_text["table"];
                this.setState(new_state);

                
                
            }
        );

    }

    onClickDeleteList(e, ci, label){

        var send_data = Object.assign({}, this.state);
        send_data["label"] = label;
        send_data["type"] = "delete";
        
        if(label=="holidays-table"){
            send_data["delete-target"] = this.state[label][ci]["date"];
        }else if(label=="cache-table"){
            send_data["delete-target"] = this.state[label][ci]["code"];            
        }


        request.post('/admin_list').set('Content-Type', 'application/json; charset=utf-8').send(send_data).end(
            (error, res) => {

                var res_text = JSON.parse(res.text);
                alert(res_text["comment"]);

                var new_state = Object.assign({},this.state);
                new_state[label].splice(ci,1);
                this.setState(new_state);   
            }
        );

    }

    onCloseList(e, label){

        var new_state = Object.assign({},this.state);
        new_state[label] = [];

        if(label=="holidays-table"){
            new_state["holidays-table-year"] = "";
        }
        
        this.setState(new_state);

    }

    render(){
        
        return(
            <div id="admin_page">

                <h1>財源をアップロード</h1>
                <div className="mycard flex-row-left">
                    <FinanceUploader onUpload={(e, filename)=>this.onUpload(e, filename)} filename={this.state["upload_filename"]}/>
                    <BlueButton value="確定" onClick={(e)=>this.onClickUpload(e)}/>
                </div>

                {/* ユーザー情報の消去 */}
                <h1>ユーザーの消去</h1>
                <div className="mycard flex-row-left">
                    <TextBox label="メールアドレス" value={this.state["delete_e-mail"]} onChange={(e)=>this.onChange(e, "delete_e-mail")}/>
                    <BlueButton value="消去" onClick={(e)=>this.onAdminProcess(e, "client-delete")}/>
                </div>

                {/* 管理者権限の付与 */}
                <h1>管理者権限の付与/剥奪</h1>
                <div className="mycard flex-row-left">
                    <TextBox label="メールアドレス" value={this.state["admin_e-mail"]} onChange={(e)=>this.onChange(e, "admin_e-mail")}/>
                    <BlueButton value="付与" onClick={(e)=>this.onAdminProcess(e, "admin-present")}/>
                    <BlueButton value="消去" onClick={(e)=>this.onAdminProcess(e, "admin-delete")}/>
                </div>

                {/* 無駄なダウンロードファイルの消去 */}
                <h1>ダウンロードキャッシュデータの消去</h1>
                <div className="mycard flex-row-left">
                    <BlueButton value="消去" onClick={(e)=>this.onAdminProcess(e, "cache-delete")}/>
                </div>

                {/* 祝日・休日の追加*/}
                <h1>祝日・休日の追加</h1>
                <div className="mycard flex-column-left">
                    
                    <TextBox label="年" value={this.state["holidays-addition-year"]} onChange={(e)=>this.onChange(e, "holidays-addition-year")}/>
                    <TextBox label="月" value={this.state["holidays-addition-month"]} onChange={(e)=>this.onChange(e, "holidays-addition-month")}/>
                    <TextBox label="日" value={this.state["holidays-addition-day"]} onChange={(e)=>this.onChange(e, "holidays-addition-day")}/>
                    <TextBox label="内容" value={this.state["holidays-addition-content"]} onChange={(e)=>this.onChange(e, "holidays-addition-content")}/>
                    <BlueButton value="追加" onClick={(e)=>this.onAdminProcess(e, "holidays-addition")}/>
                </div>

                {/* 祝日の一覧（年ごと）・消去 */}
                <h1>祝日・休日の一覧取得</h1>                
                <div className="mycard flex-column-left">
                    
                    <div className="flex-row-left">
                        <TextBox label="年度" value={this.state["holidays-table-year"]} onChange={(e)=>this.onChange(e, "holidays-table-year")}/>
                        <BlueButton value="表示" onClick={(e)=>this.onAdminList(e, "holidays-table")}/>
                        <BlueButton value="閉じる" onClick={(e)=>this.onCloseList(e, "holidays-table")}/>
                    </div>

                    <HolidaysTable holidays_table={this.state["holidays-table"]} onClickDelete={(e,ci)=>this.onClickDeleteList(e, ci, "holidays-table")}/>

                </div>                


                <div className="mycard">
                    <BlueButton value="戻る" onClick={(e)=>this.back(e)}/>
                </div>

            </div>
        );
    }
}

export default AdminPage;
