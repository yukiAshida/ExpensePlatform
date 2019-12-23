import React,{Component} from 'react'
import ReactDOM from 'react-dom'
import XLSX from 'xlsx'
import '../../statics/css/uploader.css'


export class FinanceUploader extends Component{

    constructor(props){
        super(props);
        this.state = {};
    }

    uploadFile(e){
        
        var f = e.target.files[0];
        var fileReader = new FileReader();

        fileReader.onload = (e)=>{

            if(f.name.slice(-5)!=".xlsx"){
                alert("ファイル形式が違います");
                return -1;
            }

            var data = new Uint8Array(e.target.result);
            var wb = XLSX.read(data, {type: 'array'});
            var ws = wb.Sheets["近距離旅費用"];

            // 財源数をカウント
            var start = 4;
            var end = start;
            while( ws["A"+end.toString()]!=undefined ){
                end += 1;
            }

            // 連番配列（セル番号）
            var list = [...Array(end-start).keys()].map(i => i+start);
            
            // 結果の格納
            var result = {};

            // 順に財源を格納
            for(var i of list){

                var finance_name = ws["B"+i.toString()].h;

                result[finance_name] = [];

                for(var alpha of ["E","F","G","H","I","J","K","L"]){
                
                    var cell = ws[alpha+i.toString()];
                    var content = cell==undefined ? "" : cell.h;
                    result[finance_name].push(content);
                }
            }

            this.props.onUpload(result, f.name);
        }
        
        fileReader.readAsArrayBuffer(f);
    }

    render(){
        
        return(

            <div style={{margin:"20px"}}>
                <label id="file-uploader-label" htmlFor="file-uploader">
                    { this.props.filename!=""?this.props.filename:"ファイルを選択してください"}    
                    <input id="file-uploader" type="file" onChange={(e)=>this.uploadFile(e)} />
                </label>
            </div>

        );
    }
}

