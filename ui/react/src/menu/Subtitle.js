import React from 'react';

export default class Subtitle extends React.Component {
    state = {};
    constructor (data) {
        super(data);
        this.state = {
            buttons: data.buttons,
            subtitleText: data.subtitle,
        };
        this.getSelectedButton = data.getSelectedButton
        this.getSubtitle = this.getSubtitle.bind(this)
    };

    getSubtitle () {
        return this.state.subtitleText
    }

    getSubtitlePagination () {
        return (this.getSelectedButton()+1)+"/"+this.state.buttons.length
    }

    render() {
        let subtitleText = this.getSubtitle()
        let subtitlePagination = this.getSubtitlePagination()
        return (      
            <div key={"menuSubtitle"} id="menuSubtitle" className="unselectable">
                <span key={"menuSubtitleText"} className="menuSubtitleText">{subtitleText}</span>
                <span key={"menuSubtitlePagination"} className="menuSubtitlePagination">{subtitlePagination}</span>
            </div>
        )
    }
}