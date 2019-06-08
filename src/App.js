import React from 'react';
import './App.scss';
import "bulma";
import Header from "./components/Header";
import msgpack from "msgpack-lite";
import Server from "./components/Server.js"
import i18n from "./i18n";
import _ from "lodash";


export default class App extends React.Component {

    constructor(props){
        super(props);

        let self = this;


        self.state = {
            mrmp: {}
        };
    }



    componentDidMount() {
        let self = this;

        fetch("/api/blob/get").then((response)=>{
            response.arrayBuffer().then((buf) => {
                let mrmp = msgpack.decode(new Buffer(buf));
                console.log(mrmp);
                self.setState({
                    mrmp
                });
            });
        }).catch(() => {
            console.log(arguments)
        });
    }

    _get_category(key){

        switch(key){

            case "IMAP":
            case "POP":
                return "in";

            case "SMTP":
                return "out";
        }
    }

    collect_server_information(init_data){
        let self = this;

        let config = {
            "server_name": init_data.server_name,
            "config": {},
            "round": [],
            "status": [],
        };

        let key = self._get_category(init_data.server_type);
        config["config"][key] = init_data;

        self.state.mrmp.config.server.forEach((item)=>{
            let key = self._get_category(item.server_type);
            config["config"][key] = init_data;
        });

        self.state.mrmp.config.round.forEach((round) => {
            if(round.in === config.server_name || round.out === config.server_name){
                config.round.push(round);
            }
        });

        self.state.mrmp.status.forEach((status) => {
            if(status.in === config.server_name || status.out === config.server_name){
                config.status.push(status);
            }
        });
        return config;
    }


    get_server_components(){
        let self = this;
        let server_list = [];

        let used_server = [];

        self.state.mrmp.config.server.forEach((config) => {
            if(!_.includes(used_server, config.server_name)) {
                server_list.push(<Server key={config.server_name} info={self.collect_server_information(config)} />);
                used_server.push(config.server_name);
            }
        });
        return server_list;
    }

    render(){
        let self = this;
        return (
            <div>
                <Header />

                <br />

                <div className={"container is-fluid"} >

                    {
                        (() => {
                            if(self.state.mrmp.hasOwnProperty("config")){
                                if(self.state.mrmp.config.server.length > 0){
                                    return self.get_server_components();
                                }
                            }
                            return (<div>{i18n("The Serverlist is currently Empty")}</div>);
                        })()


                    }
                </div>
            </div>
        );
    }


}