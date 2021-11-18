import React from 'react';

import Banner from './Banner.js'
import Subtitle from './Subtitle.js'
import Button from './Button.js'
import ListButton from './ListButton.js'

import ArrowsUpAndDown from './ArrowsUpAndDown.js'
import Divider from './Divider.js'
import {isEnvBrowser, recursiveAssign, callFivemCallback} from './../utils.js'

let debugMenu = true

function getDefaultMenu() {
    if (isEnvBrowser() && debugMenu) {
        return {
            "width": "25vw",
            "padding": "2vh",
            "banner": {
                "height":'10vh',
                "title":"Title",
                "backgroundImage":"https://raw.githubusercontent.com/LH-Lawliet/redmUtils/main/generic_textures/menu_header_1a.png",
            },
            "backgroundImage":"https://raw.githubusercontent.com/LH-Lawliet/redmUtils/main/pausemenu_textures/menu_ink_large1.png",
            "subTitle": "Subtitle",
            "maxButtons":10,
            "currentButton":0,
            "mouse":true,
            "buttons":[
                {text:"Button 1"},
                {text:"CheckBox", rightComponent:'checkbox'},
                {text:"list", type:'list', list:["elem 1", "elem 2", "elem 3"]},
                {text:"Carcolor", rightComponent:"colorPicker", onColorChange:'function jsp'},
                {text:"button"},
                {text:"button2"},
                {text:"button3"},
                {text:"button4"},
                {text:"button5"},
                {text:"button6"},
                {text:"button7"},
                {text:"button8"},
                {text:"button9"},
                {text:"button10"},
                {text:"button11"},
                {text:"button12"},
                {text:"button13"},
                {text:"button14"},
                {text:"button15"},
                {text:"button16"},
                {text:"button17"},
                {text:"button18"},
            ]
        }
    } else {
        return {
            "width": "25vw",
            "padding": "2vh",
            "banner": {
                "height":'10vh',
                "title":"Title",
                "backgroundImage":"https://raw.githubusercontent.com/LH-Lawliet/gtavThings/main/img/menu/commonmenu/interaction_bgd.png",
            },
            "subTitle": "Subtitle",
            "maxButtons":10,
            "currentButton":0,
            "buttons":[]
        }
    }
    
}



export default class Menu extends React.Component {
    state = {};
    constructor () {
        super();
        this.state = {
            menuData: getDefaultMenu(),
            showMenu: isEnvBrowser() && debugMenu
        };

        this.createMenu = this.createMenu.bind(this)
        this.setMenuData = this.setMenuData.bind(this)
        this.getMenuData = this.getMenuData.bind(this)
        this.getCurrentButton = this.getCurrentButton.bind(this)
        this.menuGoUp = this.menuGoUp.bind(this)
        this.menuGoDown = this.menuGoDown.bind(this)
        this.isVisible = this.isVisible.bind(this)
        this.setVisible = this.setVisible.bind(this)
        this.setSelected = this.setSelected.bind(this)
        this.canIClick = this.canIClick.bind(this)
        this.enterDisableClickZone = this.enterDisableClickZone.bind(this)
        this.exitDisableClickZone = this.exitDisableClickZone.bind(this)
        this.isMouseControlable = this.isMouseControlable.bind(this)
        this.canClick = true
    };

    componentDidMount() {
        let setMenuData = this.setMenuData
        let menuGoUp = this.menuGoUp
        let menuGoDown = this.menuGoDown
        let isVisible = this.isVisible
        let setVisible = this.setVisible
        window.addEventListener('message', function(event) {
            if (event.data.action && event.data.action === "setMenu") {
                if (!isVisible()) {
                    setMenuData(event.data.menuData, true)
                }
            }
            if (event.data.action && event.data.action === "closeMenu") {
                if (isVisible()) {
                    setVisible(false, event.data.getState)
                }
            }
            if (event.data.action && event.data.action === "menuGoUp") {
                if (isVisible()) {
                    menuGoUp()
                }
            }
            if (event.data.action && event.data.action === "menuGoDown") {
                if (isVisible()) {
                    menuGoDown()
                }
            }
        });

        window.addEventListener('keydown', function (e) {
            if (e.key === "ArrowDown") {
                if (isVisible()) {
                    menuGoDown()
                }
            }
            if (e.key === "ArrowUp") {
                if (isVisible()) {
                    menuGoUp()
                }
            }
        });

        let isMouseControlable = this.isMouseControlable
        window.addEventListener('wheel', function (e) {
            if (isVisible() && isMouseControlable()) {
                if (e.deltaY>0) {
                    menuGoDown()
                } else {
                    menuGoUp()
                }
            }
        });
    }

    isMouseControlable() {
        return this.state.menuData.mouse
    }

    canIClick() {
        return (this.canClick && this.isMouseControlable())
    }

    enterDisableClickZone() {
        this.canClick = false
    }

    exitDisableClickZone() {
        this.canClick = true
    }

    menuGoUp() {
        let next = this.state.menuData.currentButton-1
        if (next<0) {
            next = this.state.menuData.buttons.length-1
        }
        let menuData = this.state.menuData
        menuData.currentButton = next
        this.setState({menuData: this.state.menuData})
    }

    menuGoDown() {
        let next = this.state.menuData.currentButton+1
        if (next >= this.state.menuData.buttons.length) {
            next = 0
        }
        let menuData = this.state.menuData
        menuData.currentButton = next
        this.setState({menuData: this.state.menuData})
    }

    isVisible() {
        return this.state.showMenu
    }

    setVisible(visible, callbackState) {
        if (visible) {
            this.setState({showMenu:visible})
        } else {
            if (callbackState) {
                callFivemCallback("updateMenuState", this.getMenuData())
            }
            this.setState({showMenu:visible, menuData:getDefaultMenu()})
        }
        
    }

    getCurrentButton() {
        return this.state.menuData.currentButton
    }

    setMenuData(data, forceVisible) {
        let menu = getDefaultMenu()
        recursiveAssign(menu,data)
        if (forceVisible) {
            this.setState({menuData:menu, showMenu:true})
        } else {
            this.setState({menuData:data})
        }
    }

    getMenuData() {
        return this.state.menuData
    }

    setSelected(id) {
        let menuData = this.state.menuData
        menuData.currentButton = id
        this.setState({menuData: this.state.menuData})
    }

    createMenu(data) {
        if (!this.isVisible()) {
            return
        }
        
        let menu = []
        
        menu.push(<img key="menuBackgroundImage" src={data.backgroundImage} alt='menuBackgroundImage' className="unselectable menuBackgroundImage"/>)
        menu.push(<Banner key={"banner"} data={data.banner}/>)
        menu.push(<Subtitle key={"SubTitle"} subtitle={data.subTitle} buttons={data.buttons} getSelectedButton={this.getCurrentButton}/>)
        menu.push(<Divider key={"Divider"}/>)

        if ((data.buttons) && (data.buttons.length !== 0)) {
            let start = 0
            let end = data.maxButtons

            if (end>data.buttons.length) {
                end = data.buttons.length
            }

            if (this.isMouseControlable()) {
                if ( (end-1)<data.currentButton) {
                    start = data.currentButton-(data.maxButtons-1)
                    end = data.currentButton+1
                }
            } else {
                if ( (end-2)<data.currentButton ) {
                    start = data.currentButton-(data.maxButtons-2)
                    end = data.currentButton+2
                }
            }


            if (end>data.buttons.length-1) {
                end = data.buttons.length
                start = end-data.maxButtons
            }


            if (start<0) {
                start = 0
            }

            if (end<0) {
                end = 0
            }

            this.oldStart = start
            this.oldEnd = end

            for (let n = start; n < end; n++) {
                let k = n+""

                let thisButton = data.buttons[k]

                if (n === data.currentButton) {
                    thisButton.selected = true
                } else {
                    thisButton.selected = false
                }

                
                thisButton.id = n
                let setSelected = this.setSelected
                let enterDisableClickZone = this.enterDisableClickZone
                let exitDisableClickZone = this.exitDisableClickZone
                let canIClick = this.canIClick

                if (!thisButton.type) {
                    menu.push(<Button key={n} button={thisButton} exitDisableClickZone={exitDisableClickZone} enterDisableClickZone={enterDisableClickZone} canIClick={canIClick} onMouseOver={function () {setSelected(n)}}/>)
                } else if (thisButton.type === "list") {
                    menu.push(<ListButton key={n} button={thisButton} enterDisableClickZone={enterDisableClickZone} exitDisableClickZone={exitDisableClickZone} canIClick={canIClick} onMouseOver={function () {setSelected(n)}}/>)
                }
            }

            if (data.buttons.length>data.maxButtons) {
                menu.push(<ArrowsUpAndDown key={"ArrowsUpAndDown"}/>)
            }
        }
        
        return menu
    }

    render() {
        let menuData = this.getMenuData()
        let menu = this.createMenu(menuData)
        return (      
            <div id="Menu" style={{"padding":menuData.padding, "width":menuData.width}}>{menu}</div>
        )
    }
}