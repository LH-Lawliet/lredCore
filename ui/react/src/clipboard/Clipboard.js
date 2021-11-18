import React from 'react';

export default class ClipboardInput extends React.Component {
    state = {};
    constructor () {
        super();
        this.state = {
            visibility:"hidden"
        };
        this.copyToClipboard = this.copyToClipboard.bind(this);
        let copyToClipboard = this.copyToClipboard
        window.addEventListener('message', function(event) {
            if (event.data.copyText) {
                copyToClipboard(event.data.copyText);
            }
        });
    };

    copyToClipboard(text) {
        this.setState({visibility:"visible"});
        let el =  document.getElementById("textToCopy");
        el.value = text;
        el.select();
        el.setSelectionRange(0, 99999);

        document.execCommand("copy");
        this.setState({visibility:"hidden"});
    };

    render() {
        return (      
            <input type="text" defaultValue="" id="textToCopy" style={{visibility:this.state.visibility}}></input>
        )
    }
}