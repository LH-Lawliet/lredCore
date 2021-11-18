import React from 'react';

let vignetteImg = 'https://raw.githubusercontent.com/LH-Lawliet/gtavThings/main/img/menu/mom_dad/menu/vignette.png'
let baseHeritageUrl = 'https://raw.githubusercontent.com/LH-Lawliet/gtavThings/main/img/menu/mom_dad/portraitsById/'

export default class Banner extends React.Component {
    state = {};
    constructor (data) {
        super(data);
        this.state = {
            title: data.data.title,
            backgroundImage: data.data.backgroundImage,
            heritage: data.data.heritage,
            height: data.data.height,
            vignette: data.data.vignette
        };
        this.renderImage = this.renderImage.bind(this)
    };


    renderImage() {
        let bannerImage = []

        bannerImage.push(<img key="menuBannerImage" src={this.state.backgroundImage} alt='menuBannerImage' className="unselectable menuBannerBackground"/>)

        if (this.state.heritage) {
            if (this.state.heritage[0] != null) {
                bannerImage.push(<img key="menuBannerHeritageLeft" src={baseHeritageUrl+this.state.heritage[0]+'.png'} alt='heritageLeft' className="unselectable menuBannerHeritageLeft"/>)
            }
            if (this.state.heritage[1] != null) {
                bannerImage.push(<img key="menuBannerHeritageRight" src={baseHeritageUrl+this.state.heritage[1]+'.png'} alt='heritageRight' className="unselectable menuBannerHeritageRight"/>)
            }
        }
        if (this.state.vignette) {
            bannerImage.push(<img key="menuBannerVignette" src={vignetteImg} alt='menuBannerVignette' className="unselectable menuBannerBackground"/>)
        }
        return bannerImage
    }

    render() {
        let bannerImage = this.renderImage()
        return (      
            <div id="menuBanner" className="unselectable" style={{"height":this.state.height}} >
                {bannerImage}
                <span>{this.state.title}</span>
            </div>
        )
    }
}