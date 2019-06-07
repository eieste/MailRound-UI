import React from "react";
import "./ServerGeneral.scss";
import _ from "lodash";
import moment from "moment";

export default class ServerGeneral extends React.Component {

    constructor(props) {
        super(props);
        let self = this;

        self.state = {
            "server_state": "nodata",
            "last_scan": 0
        }
    }

    componentDidMount() {

        let self = this;
        let day = self.props.config[moment("18:00 05.06.2019", "HH:mm DD.MM.YYYY").format("DD-MM-YYYY")]

        if(day == undefined){
            self.setState({
                "server_state": "nodata"
            });
        }

        let newest = null;

        let group_list = Object.assign({}, day.group_in, day.group_out);

        _.forEach(group_list, function(group){
            if(newest == null || newest > moment.unix(group.start)){
                newest = moment.unix(group.start);
            }
        });
        console.log(newest);


        self.interval = setInterval(function(){
            self.setState({
                "last_scan": self.secondsToBest(moment.duration(moment().diff(newest)).asSeconds())
            })
        }, 1000);
    }

    secondsToBest(sec) {
        var hrs = Math.round(Math.floor(sec / 3600));
        var min = Math.floor((sec - (hrs * 3600)) / 60);
        var seconds = sec - (hrs * 3600) - (min * 60);
        seconds = Math.round(seconds * 100) / 100
        /*
         var result = (hrs < 10 ? "0" + hrs : hrs);
         result += "-" + (min < 10 ? "0" + min : min);
         result += "-" + (seconds < 10 ? "0" + seconds : seconds);

         */

        if(hrs > 0){
            return hrs+" Hours"
        }

        if(min > 0){
            return min+" Minutes"
        }

        if(seconds > 20){
            return seconds+"Seconds"
        }

        return "Now";
    }


    render(){
        let self = this;

        return (
            <div className={"state"}>
                    <div className={"state-dot"}></div>
                    <div className={"state-text"}> Operational (last scan {self.state.last_scan})</div>
             </div>
        );
    }
}