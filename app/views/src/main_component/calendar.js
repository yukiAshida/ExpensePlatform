import React, {Component} from 'react';
import Calendar from 'rc-calendar';
import 'rc-calendar/assets/index.css';
import moment from 'moment';

export class MyCalendar extends Component {
    
    constructor(props) {
        super(props);
    }

    render() {
        var y = this.props.state["year"];
        var m = this.props.state["month"];
        var d = this.props.state["day"];
        var format = "YYYY年 " + (m>9?" MM":"  M") + "月 " + (d>9?" DD":"  D") + "日";
        
        return (
            <div id="CALENDAR">
                <Calendar
                    onChange={(e)=>this.props.onChange(e)}
                    format={format||'YYYY年 MM月 DD日'}
                />
            </div>
        )
    }
}
