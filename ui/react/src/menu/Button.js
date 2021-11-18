import React from 'react';

import {callFivemCallback, hexToRGB} from './../utils.js'
let checkBoxBlankUrl = "https://raw.githubusercontent.com/LH-Lawliet/redmUtils/main/menu_textures/selection_box_square.png"
let checkBoxCheckedkUrl = "https://raw.githubusercontent.com/LH-Lawliet/redmUtils/main/menu_textures/selection_box_squareChecked.png"
let backgroundImgUrl = "https://raw.githubusercontent.com/LH-Lawliet/redmUtils/main/menu_textures/crafting_outline.png"


export default class Button extends React.Component {
    state = {};
    constructor (data) {
        super(data);

        if (data.button.rightLogo) {
            if (data.button.rightLogo === ">") {
                data.button.rightComponent = 'img'
                data.button.rightImgUrl = "https://raw.githubusercontent.com/LH-Lawliet/gtavThings/main/img/menu/commonmenu/arrowright.png"
            }
            if (data.button.rightLogo === "dead") {
                data.button.rightComponent = 'img'
                data.button.rightImgUrl = "https://raw.githubusercontent.com/LH-Lawliet/gtavThings/main/img/menu/commonmenutu/deathmatch.png"
            }
        }

        this.state = {
            buttonData: data.button
        };
        this.mounted = false
        this.onMouseOver = data.onMouseOver

        this.canIClick = data.canIClick
        this.exitDisableClickZone = data.exitDisableClickZone
        this.enterDisableClickZone = data.enterDisableClickZone

        this.getText = this.getText.bind(this)
        this.getRightText = this.getRightText.bind(this)
        this.isSelected = this.isSelected.bind(this)
        this.renderButton = this.renderButton.bind(this)
        this.menuPressSelect = this.menuPressSelect.bind(this)
        this.didImMounted = this.didImMounted.bind(this)
        this.colorChange = this.colorChange.bind(this)
        this.setToChecked = this.setToChecked.bind(this)
        this.setToUnchecked = this.setToUnchecked.bind(this)
    };


    componentDidMount() {
        let menuPressSelect = this.menuPressSelect
        let didImMounted = this.didImMounted
        let isSelected = this.isSelected
        this.mounted = true

        window.addEventListener('message', function(event) {
            if (event.data.action && event.data.action === "menuPressSelect") {
                //console.log("get message to menuPressSelect")
                if (didImMounted() && isSelected()) {
                    menuPressSelect()
                }
            }
        });

        window.addEventListener('keydown', function (e) {
            if (e.key === "Enter") {
                //console.log("get keydown to menuPressSelect")
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
        if (!button.rightComponent || !(button.rightComponent === "checkbox")) {
            if (this.didImMounted() && button && button.callback && this.isSelected()) {
                callFivemCallback("callButtonCallback", button)
            }
        } else {
            if (button.checked) {
                this.setToUnchecked()
            } else {
                this.setToChecked()
            }
        }
        return
    }

    getText () {
        return this.state.buttonData.text
    }

    getRightText () {
        return this.state.buttonData.text
    }

    isSelected () {
        return this.state.buttonData.selected
    }

    colorChange(color) {
        let button = this.state.buttonData
        if (this.didImMounted() && button && button.onColorChange && this.isSelected()) {
            callFivemCallback("callButtonCallback", {callback:button.onColorChange, callbackData:hexToRGB(color)})
        }
    }

    setToChecked() {
        let button = this.state.buttonData
        if (this.didImMounted() && button && button.onCheck && this.isSelected()) {
            callFivemCallback("callButtonCallback", {callback:button.onCheck})
        }
        button.checked = true
        this.setState({buttonData:button})
    }

    setToUnchecked() {
        let button = this.state.buttonData
        if (this.didImMounted() && button && button.onUncheck && this.isSelected()) {
            callFivemCallback("callButtonCallback", {callback:button.onUncheck})
        }
        button.checked = false
        this.setState({buttonData:button})
    }

    renderButton () {
        let button = []
        if (this.isSelected()) {
            button.push(<img key="menuButtonBackgroundImage" src={backgroundImgUrl} alt='menuButtonBackgroundImage' className="unselectable menuButtonBackgroundImage"/>)
        }
        if (this.state.buttonData.text) {
            button.push(<span key={this.state.buttonData.id+"menuButtonLeftText"} className={"menuButtonLeftText unselectable"} style={this.state.buttonData.textStyle}>{this.state.buttonData.text}</span>)
        }
        if (this.state.buttonData.rightText) {
            button.push(<span key={this.state.buttonData.id+"menuButtonRightText"} className={"menuButtonRightText unselectable"} style={this.state.buttonData.rightTextStyle}>{this.state.buttonData.rightText}</span>)
        } else if (this.state.buttonData.rightComponent) {
            let colorChange = this.colorChange
            let enterDisableClickZone = this.enterDisableClickZone
            let exitDisableClickZone = this.exitDisableClickZone
            if (this.state.buttonData.rightComponent === "colorPicker") {
                button.push(
                    <input 
                        key={this.state.buttonData.id+"menuButtonRightComponent"} 
                        className={"menuButtonRightComponent color unselectable"} 
                        type="color" 
                        id={this.state.buttonData.id+"menuButtonRightComponent"} 
                        name={this.state.buttonData.componentText} 
                        readOnly={this.state.colorOfInput || "#000000"}
                        onChange={function (e) {colorChange(e.target.value)}}
                        onMouseEnter={enterDisableClickZone}
                        onMouseLeave={exitDisableClickZone}
                    />
                )
            } else if (this.state.buttonData.rightComponent === "checkbox") {
                if (this.state.buttonData.checked) {      
                    let setToUnchecked = this.setToUnchecked
                    button.push(
                        <img
                            key={this.state.buttonData.id+"menuButtonRightComponent"} 
                            alt="☑"
                            className={"menuButtonRightComponent checkBox unselectable"}
                            src={checkBoxCheckedkUrl}
                            onMouseEnter={enterDisableClickZone}
                            onMouseLeave={exitDisableClickZone}
                            onMouseDown={setToUnchecked}
                        />         
                    )  
                } else {
                    let setToChecked = this.setToChecked
                    button.push(
                        <img
                            key={this.state.buttonData.id+"menuButtonRightComponent"} 
                            alt="☐"
                            className={"menuButtonRightComponent checkBox unselectable"}
                            src={checkBoxBlankUrl}
                            onMouseEnter={enterDisableClickZone}
                            onMouseLeave={exitDisableClickZone}
                            onMouseDown={setToChecked}
                        />  
                    )
                }
            } else if (this.state.buttonData.rightComponent === "img") {
                let url = this.state.buttonData.rightImgUrl
                button.push(
                    <img
                        key={this.state.buttonData.id+"menuButtonRightComponent"} 
                        alt="rightImg"
                        className={"menuButtonRightComponent unselectable"}
                        src={url}
                    />  
                )
            }
        }
        return button
    }

    render() {
        let button = this.renderButton()       
        let className = "menuButton"
        let onMouseOver = this.onMouseOver
        if (this.isSelected()) {
            className += " menuSelectedButton"
        }
        
        let canIClick = this.canIClick
        let menuPressSelect = this.menuPressSelect
        return (      
            <div 
                className={className} 
                onMouseOver={onMouseOver} 
                onMouseDown={ function () {
                    if (canIClick()) {
                        menuPressSelect()
                    }
                }}
            >
                {button}
            </div>
        )
    }
}