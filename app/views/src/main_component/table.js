import React, {Component} from 'react';
import '../../statics/css/table.css';

export const ReferenceDisplay = (props)=>{
    var W = props.width || "150px";
    var H = props.height || "50px";
    var F = props.fontsize || "20px";
    var M = props.margin || "20px";

    var n_row = props.table_values.length;

    return (
        <table>
            
            {props.table_values.map((values,ci) => {
                return <tr key={ci} className={props.selected==values["alias"]?"tr-selected":"tr-no-selected"} onClick={(e)=>props.onClick(e, values["alias"])}>
                    <td>{values["alias"]}</td>
                    <td>{values["route"]}</td>
                    <td>{values["fare"]}</td>
                </tr>
            })}

        </table>
    );
}


export const RouteDisplay = (props)=>{

    // props.data[i]["date"]: str ("yyyy/mm/dd")
    // props.data[i]["locate"]: str ("柏の葉キャンパス")
    // props.data[i]["purpose"]: str ("実験")
    // props.data[i]["route"]: str ("Sta.A=Sta.B-Sta.C")
    // props.data[i]["fare"]: str ("1000(往復)")
    
    return (
        <table>

            <tr className="header">
                <th className="route-display-c1">日付</th>
                <th className="route-display-c2">用務先</th>
                <th className="route-display-c3">目的</th>
                <th className="route-display-c4">経路</th>
                <th className="route-display-c5">金額</th>
                <th className="route-display-c6">削除</th>
            </tr>

            {props.state["data"].map((values,ci) => {
                return <tr key={ci} className={props.selected==ci?"tr-selected":"tr-no-selected"}>
                    <td className="route-display-c1">{values["date"]}</td>
                    <td className="route-display-c2">{values["locate"]}</td>
                    <td className="route-display-c3">{values["purpose"]}</td>
                    <td className="route-display-c4">{values["route"].replace(/%=%/g, "=").replace(/%-%/g, "-")}</td>
                    <td className="route-display-c5">{values["fare"]}</td> 
                    <td className="route-display-c6 delete-button"><button type="button" onClick={(e)=>props.onClickDelete(e,ci)}>×</button></td>
                </tr>
            })}
            
        </table>
    );
}



export const HolidaysTable = (props)=>{


    return (
        <div className="flex-column" >
            <table>
                <tr>
                    <th>日付</th>
                    <th>内容</th>
                    <th>削除</th>
                </tr>

                {props.holidays_table.map((values,ci) => {
                    return <tr key={ci}>
                        <td className="">{values["date"]}</td>
                        <td className="">{values["content"]}</td> 
                        <td className="delete-button"><button type="button" onClick={(e)=>props.onClickDelete(e,ci)}>×</button></td>
                    </tr>
                })}
                
            </table>
        </div>
    );
}

export const CacheTable = (props)=>{

    console.log(props.cache_table)
    return (
        <div className="flex-column" >
            <table>
                <tr>
                    <th className="cache-table-c1">申請コード</th>
                    <th className="cache-table-c2">申請者</th>
                    <th className="cache-table-c3">開始期間</th>
                    <th className="cache-table-c4">終了期間</th>
                    <th className="cache-table-c5">削除</th>
                </tr>

                {props.cache_table.map((values,ci) => {
                    return <tr key={ci}>
                        <td className="cache-table-c1">{values["code"]}</td>
                        <td className="cache-table-c2">{values["name"]}</td>
                        <td className="cache-table-c3">{values["term-start"]}</td>
                        <td className="cache-table-c4">{values["term-end"]}</td>
                        <td className="cache-table-c5 delete-button"><button type="button" onClick={(e)=>props.onClickDelete(e,ci)}>×</button></td>
                    </tr>
                })}
                
            </table>
        </div>
    );
}