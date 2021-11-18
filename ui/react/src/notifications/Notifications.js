import React from 'react';

function getDefaultNotification() {
    return {
        "background": "https://raw.githubusercontent.com/LH-Lawliet/redmUtils/main/generic_textures/help_text_1b.png",
        "imageFrame": "https://raw.githubusercontent.com/LH-Lawliet/redmUtils/main/pausemenu_textures/box_border_decor_small_square.png",
        "timeOut": 3000,
    } 
}

export default class Notifications extends React.Component {
    state = {};
    constructor () {
        super();
        this.state = {
            notificationsList: [],
        };

        this.getNotifications = this.getNotifications.bind(this)
        this.pushNotification = this.pushNotification.bind(this)
        this.removeNotification = this.removeNotification.bind(this)
    };

    componentDidMount() {
        let pushNotification = this.pushNotification

        /*pushNotification({"text":"Les lorientaises sont comme des hommards elles ont toutes des rubans rouge et noir ..."})
        pushNotification({"text": "petit texte mais grosse notif", "title": "yes life", "subtitle": "..."})
        pushNotification({"title": "Petit Brestoi", "subtitle": "ENIB meilleur école de france", "picture":"https://media.comicbook.com/2019/07/sadie-1178519.jpeg?auto=webp&width=696&height=773&crop=696:773,smart", "text":"Et c'est alors que le petit brestois, jura mais un peu tard, de ne plus faire chambard, car il voyait germer en sont cerveau, bérénice cayenne conseille de guerre à l'échafaud, et en avant la maritime les chevalier d'la discipline, nous irons tous a pont-aniou, casser des caillou, comme des vrais piou pioou... Serons les rangs et marchons calmement, sous les drapeaux de la machine a carreau, Vivre sans soucis boire du purain bouffer de la merde, c'est le seul moyen de ne jamais creuver de fin, Zob Pute Calbute Saint-Sulpice"})
        
        setInterval(function(){ 
            pushNotification({"text":"Les lorientaises sont comme des hommards elles ont toutes des rubans rouge et noir ..."})
        }, 950);*/

        window.addEventListener('message', function(event) {
            if (event.data.action && event.data.action === "notify") {
                pushNotification(event.data.notification)
            }
        });
    }

    pushNotification(notification) {
        let defaultNotification = getDefaultNotification()

        this.state.notificationsList.push(notification)
        this.setState({notificationsList:this.state.notificationsList})

        let removeNotification = this.removeNotification
        setTimeout(function (notificationToDelete){
            removeNotification(notificationToDelete)
        }, notification.timeOut || defaultNotification.timeOut, notification);
    }

    removeNotification(notification) {
        this.state.notificationsList.splice(this.state.notificationsList.indexOf(notification),1)
        this.setState({notificationsList:this.state.notificationsList})
    }   

    getNotifications() {
        return this.state.notificationsList
    }


    createNotificationsPanel(notifications) {
        let notificationsElement = []
        for (const i in notifications) {
            let notification = notifications[i]
            let defaultNotification = getDefaultNotification()

            let notificationHeader = []
            let header = false

            if (notification.title) {
                header = true
                let className = "notificationTitle"
                if (notification.picture) {
                    className += " withPicture"
                }
                notificationHeader.push(<span className={className}>{notification.title}</span>)
            }
            if (notification.subtitle) {
                header = true
                let className = "notificationSubtitle"
                if (notification.picture) {
                    className += " withPicture"
                }
                notificationHeader.push(<span className={className}>{notification.subtitle}</span>)
            }

            if (notification.picture) {
                header = true
                notificationHeader.push(<img className="notificationPicture" alt="notificationPicture" src={notification.picture}></img>)
                notificationHeader.push(<img className="notificationPictureFrame" alt="notificationPictureFrame" src={notification.imageFrame || defaultNotification.imageFrame}></img>)
            }

            notificationsElement.push(
                <div className="notification unselectable" key={"notification n"+i}>
                    <div className="NotificationHeader" style={{"margin-bottom":(header?"2vh":"0vh")}}>
                        {notificationHeader}
                    </div>
                    <span className="notificationMainText">{notification.text}</span>
                    <img className="notificationBackground" alt="notificationBackground" src={notification.background || defaultNotification.background}></img>
                </div>
            )
        }
        return notificationsElement
    }

    render() {
        let notificationsList = this.getNotifications()
        let notifications = this.createNotificationsPanel(notificationsList)
        return (      
            <div id="Notifications">{notifications}</div>
        )
    }
}