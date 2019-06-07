import React from "react";



export default class Header extends React.Component{


    render(){
        return (
            <nav role="navigation" aria-label="main navigation" className="navbar has-shadow">
                <div className="navbar-brand">
                    <a href="/#" className="navbar-item">
                        MailRound Web
                    </a>
                    <a role="button" aria-label="menu" aria-expanded="false" className="navbar-burger burger">
                        <span aria-hidden="true" /> <span aria-hidden="true" /> <span aria-hidden="true" />
                    </a>
                </div>
                <div className="navbar-menu">
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons"><a href="/#" className="button is-success"><strong>Refresh</strong></a></div>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}