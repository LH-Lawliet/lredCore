import React from 'react';
import ClipboardInput from './clipboard/Clipboard.js'
import WIPAlert from './wipAlert/WIPAlert.js'
import Menu from './menu/Menu.js'
import Notifications from './notifications/Notifications.js'

export default class App extends React.Component {
    render() {
        return (
        <div>
            <ClipboardInput/>
            <WIPAlert/>
            <Menu/>
            <Notifications/>
        </div>
        )
    }
}