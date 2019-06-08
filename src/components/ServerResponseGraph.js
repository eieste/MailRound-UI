import React from "react";
import { Chart } from "react-charts";
import _ from "lodash";

export default class ServerResponseGraph extends React.Component {

    constructor(props) {
        super(props);
        let self = this;

        self.state = {
            data_series: []
        };
    }

    componentDidMount() {
        let self = this;
        let round_duration_series = [];

        let group_key = ( self.props.server_type == "out" ? "group_out" : "group_in");

        _.forEach(self.props.config, function(date, date_name){
            _.forEach(date[group_key], function(state){
                round_duration_series.push({
                    "x": state.start,
                    "y": state.round_duration
                });
            });
        });

        self.setState({
            data_series: [
                {
                    "label": "Full time of check",
                    "data": round_duration_series
                }
            ]
        });
    }

    render(){
        let self = this;

        return (<div style={{width: "500px", height: "200px"}}>
            <Chart
                data={self.state.data_series}
                axes={[
                    {
                        primary: true,
                        position: 'bottom',
                        type: 'time',
                        show: true,
                    },
                    { position: 'left', type: 'linear', show: true },
                ]}

                primaryCursor
                secondaryCursor
                tooltip
            />
        </div>);
    }


}