import React from "react";
import moment from "moment";
import _ from "lodash";


export default class ServerUptimeCalendar extends React.Component {

    constructor(props){
        super(props);
        let self = this;

        self.begin_at = moment().subtract(100, "days").startOf("month");

    }

    check_event_at_date(cal_date){
        let self = this;

        let counts = self.props.config[cal_date.format("DD-MM-YYYY")];

        if(moment() < cal_date){
            return "future";
        }

        if(!counts || counts.count <= 0){
            return "unscanned";
        }

        let error_percent = 100*counts.error_count/counts.count;


        return self.perc2color(100-error_percent);
    }

    perc2color(perc) {
        var r, g, b = 0;
        if(perc < 50) {
            r = 255;
            g = Math.round(5.1 * perc);
        }
        else {
            g = 255;
            r = Math.round(510 - 5.10 * perc);
        }
        var h = r * 0x10000 + g * 0x100 + b * 0x1;
        return '#' + ('000000' + h.toString(16)).slice(-6);
    }


    generateWeek(date, month){
        let self = this;

        let date_in_week = date.clone().startOf("week");
        return (
            <div className={"week"} data-foo={month.format("DD-MM")}>
                {
                    (
                        () => {
                            let day_list = [];

                            for(let day = 1; day <= 7; day++){
                                let style = {};
                                let state = self.check_event_at_date(date_in_week);

                                if(!month.isSame(date_in_week, "month")){
                                    state = "othermonth";
                                }

                                if(["future", "othermonth", "unscanned"].indexOf(state) < 0 ){
                                    style = {"backgroundColor": state};
                                    state = "";
                                }

                                day_list.push(
                                    <div key={date_in_week.format("dMY")} style={style} className={"day "+state}>
                                        {date_in_week.format("D")}
                                    </div>
                                );
                                date_in_week.add(1, "day")
                            }
                            return day_list;
                        }
                    )()
                }
            </div>
        )
    }

    generateMonth(date){
        let self = this;

        let reprDate = date.clone().startOf("month");

        return (
            <div className={"month_all_week"}>

                {
                    (
                        () => {
                            let week_list = [];

                            let monthEnd = reprDate.clone().endOf("month").endOf("week");

                            while (monthEnd > reprDate) {

                                week_list.push(<div key={reprDate.month()+"_"+reprDate.week()} className={"month"}>
                                    {self.generateWeek(reprDate, date)}
                                </div>);
                                reprDate.add(1, "week");
                            }
                            return week_list;
                        }
                    )()
                }
            </div>
        )
    }

    generateCalendar(){
        let self = this;

        let reprDate = self.begin_at.clone();
        return (
            <div className={"month_list"}>
                {
                    (
                        () => {
                            let month_list = [];
                            while (moment() > reprDate) {

                                let monthName = reprDate.format("M");
                                let year = reprDate.format("YYYY");

                                month_list.push(
                                    <div key={year+"-"+monthName} className={"month month-"+monthName+" month-"+monthName+"-"+year}>
                                        <span className={"month_name"}>
                                            {reprDate.format("MMMM YYYY")}
                                        </span>
                                        <div className="month_box">
                                            {self.generateMonth(reprDate)}
                                        </div>
                                    </div>
                                );
                                reprDate.add(1, "month");
                            }
                            return month_list;
                        }
                    )()
                }
            </div>
        )
    }

    render(){
        let self = this;
        return (<div className="calendar">
            {
                self.generateCalendar()
            }
        </div>);
    }
}