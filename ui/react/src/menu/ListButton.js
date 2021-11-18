import React from 'react';
import {callFivemCallback} from './../utils.js'

let leftArrowUrl = "https://raw.githubusercontent.com/LH-Lawliet/redmUtils/main/menu_textures/selection_arrow_left.png"
let rightArrowUrl = "https://raw.githubusercontent.com/LH-Lawliet/redmUtils/main/menu_textures/selection_arrow_right.png"
let backgroundImgUrl = "https://raw.githubusercontent.com/LH-Lawliet/redmUtils/main/menu_textures/crafting_outline.png"


export default class ListButton extends React.Component {
    state = {};
    constructor (data) {
        super(data);

        data.button.list = data.button.list || ["nil"]
        data.button.selectedElementId = data.button.selectedElementId || 0
        this.state = {'buttonData':data.button}
        this.mounted = false
        this.onMouseOver = data.onMouseOver
        
        this.canIClick = data.canIClick
        this.exitDisableClickZone = data.exitDisableClickZone
        this.enterDisableClickZone = data.enterDisableClickZone

        this.getText = this.getText.bind(this)
        this.isSelected = this.isSelected.bind(this)
        this.renderButton = this.renderButton.bind(this)
        this.getSelectedElementText = this.getSelectedElementText.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)

        this.didImMounted = this.didImMounted.bind(this)
        this.menuGoRight = this.menuGoRight.bind(this)
        this.menuGoLeft = this.menuGoLeft.bind(this)
        this.menuPressSelect = this.menuPressSelect.bind(this)
        
    };
    
    componentDidMount() {
        let menuGoRight = this.menuGoRight
        let menuGoLeft = this.menuGoLeft
        let isSelected = this.isSelected
        let menuPressSelect = this.menuPressSelect
        let didImMounted = this.didImMounted
        this.mounted = true


        window.addEventListener('message', function(event) {
            if (event.data.action && event.data.action === "menuGoRight") {
                if (didImMounted() && isSelected()) {
                    menuGoRight()
                }
            }
            if (event.data.action && event.data.action === "menuGoLeft") {
                if (didImMounted() && isSelected()) {
                    menuGoLeft()
                }
            }
            if (event.data.action && event.data.action === "menuPressSelect") {
                if (didImMounted() && isSelected()) {
                    menuPressSelect()
                }
            }
        });

        window.addEventListener('keydown', function (e) {
            //console.log(e.key)
            if (e.key === "ArrowLeft") {
                if (didImMounted() && isSelected()) {
                    menuGoLeft()
                }
            }
            if (e.key === "ArrowRight") {
                if (didImMounted() && isSelected()) {
                    menuGoRight()
                }
            }
            if (e.key === "Enter") {
                if (didImMounted() && isSelected()) {
                    menuPressSelect()
                }
            }
        });
    }

    didImMounted() {
        return this.mounted
    }

    componentWillUnmount() {
        this.mounted = false
    }

    menuPressSelect() {
        let button = this.state.buttonData
        if (this.didImMounted() && button && button.callback && this.isSelected()) {
            callFivemCallback("callButtonCallback", button)
        }
    }

    getText () {
        return this.state.buttonData.text
    }

    isSelected () {
        return this.state.buttonData.selected
    }

    menuGoRight() {
        if (this.state.buttonData.selected) {
            let nextSelect = this.state.buttonData.selectedElementId + 1
            if (nextSelect > (this.state.buttonData.list.length-1)) {
                nextSelect = 0
            }
            if (this.state.buttonData.onIndexChange) {
                callFivemCallback("callButtonCallback", {callback:this.state.buttonData.onIndexChange, 'callbackData':{"key":nextSelect,"value":this.state.buttonData.list[nextSelect]}})
            }
            let button = this.state.buttonData
            button.selectedElementId = nextSelect
            this.setState({buttonData:button})
        }
    }

    menuGoLeft() {
        if (this.state.buttonData.selected) {
            let nextSelect = this.state.buttonData.selectedElementId - 1
            if (nextSelect < 0) {
                nextSelect = this.state.buttonData.list.length-1
            }
            if (this.state.buttonData.onIndexChange) {
                callFivemCallback("callButtonCallback", {callback:this.state.buttonData.onIndexChange, 'callbackData':{"key":nextSelect,"value":this.state.buttonData.list[nextSelect]}})
            }
            let button = this.state.buttonData
            button.selectedElementId = nextSelect
            this.setState({buttonData:button})
        }
    }

    getSelectedElementText() {
        return this.state.buttonData.list[this.state.buttonData.selectedElementId]
    }

    renderButton () {
        let button = []

        let className = "unselectable"
        /*if (this.isSelected()) {
            className += " menuSelectedButton"
        }*/

        if (this.isSelected()) {
            button.push(<img key="menuButtonBackgroundImage" src={backgroundImgUrl} alt='menuButtonBackgroundImage' className="unselectable menuButtonBackgroundImage"/>)
        }

        if (this.state.buttonData.text) {
            button.push(<span key={this.state.buttonData.id+"menuButtonLeftText"} className={className+" menuButtonLeftText"} style={this.state.buttonData.textStyle}>{this.state.buttonData.text}</span>)
        }

        let selectedText = this.getSelectedElementText()
        let menuGoLeft = this.menuGoLeft
        let menuGoRight = this.menuGoRight
        let enterDisableClickZone = this.enterDisableClickZone
        let exitDisableClickZone = this.exitDisableClickZone
        let canIClick = this.canIClick
        let menuPressSelect = this.menuPressSelect

        button.push(
            <div 
                key={this.state.buttonData.id+"menuButtonRightTextDiv"} 
                className = {className+" rightPartListButton"} 
                onMouseDown= { function () {
                    if (canIClick()) {
                        menuPressSelect()
                    }
                }}
            >
                <img 
                    key={this.state.buttonData.id+"menuButtonRightTextLeftArrow"} 
                    alt='leftArrow' 
                    src={leftArrowUrl} 
                    className={className} 
                    onMouseDown={menuGoLeft}
                    onMouseEnter={enterDisableClickZone}
                    onMouseLeave={exitDisableClickZone} 
                />
                <div className="spanContainer">
                    <span key={this.state.buttonData.id+"menuButtonRightText"}>{selectedText}</span>
                </div>
                <img 
                    key={this.state.buttonData.id+"menuButtonRightTextRightArrow"} 
                    alt='rightArrow' 
                    src={rightArrowUrl} 
                    className={className} 
                    onMouseDown={menuGoRight} 
                    onMouseEnter={enterDisableClickZone}
                    onMouseLeave={exitDisableClickZone} 
                />
            </div>
        )
        
        return button
    }

    render() {
        let button = this.renderButton()
        let onMouseOver = this.onMouseOver

        let className = "menuButton"
        if (this.isSelected()) {
            className += " menuSelectedButton"
        }

        return (      
            <div className={className} onMouseOver={onMouseOver}>
                {button}
            </div>
        )
    }
}