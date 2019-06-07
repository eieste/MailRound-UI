import React from "react";
import _ from "lodash";
import i18n from "../i18n";
import moment from "moment";
import ServerResponseGraph from "./ServerResponseGraph";
import ServerUptimeCalendar from "./ServerUptimeCalendar";
import ServerGeneral from "./ServerGeneral";

export default class Server extends React.Component {

    constructor(props){
        super(props);
        let self = this;
        self.state = {
            "active_tab": "general",
            "data": self.packData()
        }
    }

    changeTab(name, e){
        let self = this;
        self.setState({
            "active_tab": name
        })
    };

    packData(){
        let self = this;
        let data = {};

        _.forEach(self.props.info.status, function(state_item){
            let simple_timestamp = moment.unix(state_item.timestamp).format("DD-MM-YYYY");
            if(!data.hasOwnProperty(simple_timestamp)){

                data[simple_timestamp] = {
                    "count": 0,
                    "error_count": 0,
                    "greylisting_count": 0,
                    "group_in": {},
                    "group_out": {}
                }
            }

            let group_key = (state_item.in == self.props.info.server_name ? "group_in" : "group_out");

            if(state_item.status == "start") {
                data[simple_timestamp].count++;
            }

            if(state_item.status.indexOf("error") >= 0){
                data[simple_timestamp].error_count++;
            }

            if(state_item.status.indexOf("greylisting_count") >= 0){
                data[simple_timestamp].greylisting_count++;
            }

            if(!data[simple_timestamp][group_key].hasOwnProperty(state_item.group)){
                data[simple_timestamp][group_key][state_item.group] = {}
            }

            let group = data[simple_timestamp][group_key][state_item.group];
            group[state_item.status] = state_item.timestamp;

            if(state_item.status == "start"){
                let end = false;
                if(group.hasOwnProperty("error")){
                    end = group["error"];
                }

                if(group.hasOwnProperty("success")){
                    end = group["success"];
                }

                if(end){
                    console.log(end, state_item.timestamp);
                    group["round_duration"] = end-state_item.timestamp;
                }

            }else if(state_item.status == "error" || state_item.status == "success"){
                if(group.hasOwnProperty("start")){
                    group["round_duration"] = state_item.timestamp-group["start"];
                }
            }

            if(state_item["out"] == self.props.info.server_name){

                if(state_item.status == "start_sendmail"){
                    if(group.hasOwnProperty("end_sendmail")){
                        group["sendmail_duration"] = group["end_sendmail"]-state_item.timestamp;
                    }
                }else if(state_item.status == "end_sendmail"){
                    if(group.hasOwnProperty("start_sendmail")){
                        group["sendmail_duration"] = state_item.timestamp-group["start_sendmail"];
                    }
                }
            }
        });
        return data;
    }

    render(){

        let self = this;
        return (
            <section className="section">

                <div className="panel">
                    <p className="panel-heading">
                        {self.props.info.server_name}
                    </p>
                    <div className="panel-tabs tabs is-small is-marginless">
                        <ul>
                            {
                                (() => {
                                    let tab_menu = [
                                        <li><a className={self.state.active_tab == "general" ? 'is-active' : ''} ref={"general"} onClick={self.changeTab.bind(self, "general")}>{i18n("Allgemein")}</a></li>
                                    ];
                                    _.forEach(self.props.info.config, (config, name) => {
                                        tab_menu.push(<li key={name+"_cal"}><a className={self.state.active_tab == name+"_cal" ? 'is-active' : ''} ref={name+"_cal"} onClick={self.changeTab.bind(self, name+"_cal")}>{_.capitalize(name)+" "+i18n("Kalender")}</a></li>);
                                        tab_menu.push(<li key={name+"_graph"}><a className={self.state.active_tab == name+"_graph" ? 'is-active' : ''} ref={name+"_graph"} onClick={self.changeTab.bind(self, name+"_graph")}>{_.capitalize(name)+" "+i18n("Graphen")}</a></li>);
                                    });
                                    return tab_menu;
                                })()
                            }
                        </ul>
                    </div>
                    <div className={"panel-block"}>
                        {
                            (() => {

                                let namesplit = self.state.active_tab.split("_");

                                if(namesplit[1] ==  "cal"){
                                    return <ServerUptimeCalendar key={self.props.info.server_name+"_cal_"+namesplit[0]} config={self.state.data} server_name={self.props.info.server_name} server_type={namesplit[0]} />;
                                }else if(namesplit[1] == "graph"){
                                    return <ServerResponseGraph key={self.props.info.server_name+"_graph_"+namesplit[0]} config={self.state.data} server_name={self.props.info.server_name} server_type={namesplit[0]} />;
                                }else{
                                    return <ServerGeneral  key={self.props.info.server_name+"_general_"+namesplit[0]} config={self.state.data} server_name={self.props.info.server_name} server_type={namesplit[0]} />
                                }
                            })()
                        }
                    </div>
                </div>
            </section>
        );

    }

}