import React from "react";
import elementResizeDetector from "element-resize-detector";

import Pyramid from "../../src";
import ImageViewer from "./imageViewer";
import Cover from "./cover";

import circle from "./img/circle.svg";
import triangle from "./img/triangle.svg";
import square from "./img/square.svg";
import star from "./img/star.svg";
import hexagon from "./img/hexagon.svg";
import patternSquare from "./img/pattern_square.svg";
import patternPortrait from "./img/pattern_portrait.svg";
import patternLandscape from "./img/pattern_landscape.svg";

export default class Images extends React.Component {
    static propTypes = {
        zoomable: React.PropTypes.bool
    };

    static defaultProps = { 
        zoomable: true
    };

    constructor(props) {
        super(props);

        // Create a elementResizeDetector.
        this.erd = props.erd || elementResizeDetector({strategy: "scroll"});
    }

    render() {

        const pyramidStyle = {
            height: "calc(100% - 100px)",
            top: "100px",
        };

        const images = [
            <p style={{padding:"20px", backgroundColor: "black", color: "white", lineHeight: "1.4"}} key={30}>This is a simple demo with images (and this paragraph with unknown height). Lorem ipsum dolor sit amet. Morbi a enim in magna semper bibendum. Etiam scelerisque, nunc ac egestas consequat, odio nibh euismod nulla, eget auctor orci nibh vel.</p>,

            <img src={patternSquare} width="1000" height="1000" key={0}/>,
            <img src={circle} width="1000" height="1000" key={1}/>,
            <img src={patternPortrait} width="1000" height="1600" key={2}/>,
            <img src={triangle} width="1000" height="1000" key={3}/>,
            <img src={patternLandscape} width="1600" height="1000" key={4}/>,
            <img src={square} width="1000" height="1000" key={5}/>,
            <img src={patternSquare} width="1000" height="1000" key={6}/>,
            <img src={star} width="1000" height="1000" key={7}/>,
            <img src={patternPortrait} width="1000" height="1600" key={8}/>,
            <img src={hexagon} width="1000" height="1000" key={9}/>,
            // repeat
            <img src={patternSquare} width="1000" height="1000" key={10}/>,
            <img src={circle} width="1000" height="1000" key={11}/>,
            <img src={patternPortrait} width="1000" height="1600" key={12}/>,
            <img src={triangle} width="1000" height="1000" key={13}/>,
            <img src={patternLandscape} width="1600" height="1000" key={14}/>,
            <img src={square} width="1000" height="1000" key={15}/>,
            <img src={patternSquare} width="1000" height="1000" key={16}/>,
            <img src={star} width="1000" height="1000" key={17}/>,
            <img src={patternPortrait} width="1000" height="1600" key={18}/>,
            <img src={hexagon} width="1000" height="1000" key={19}/>,
            // repeat
            <img src={patternSquare} width="1000" height="1000" key={20}/>,
            <img src={circle} width="1000" height="1000" key={21}/>,
            <img src={patternPortrait} width="1000" height="1600" key={22}/>,
            <img src={triangle} width="1000" height="1000" key={23}/>,
            <img src={patternLandscape} width="1600" height="1000" key={24}/>,
            <img src={square} width="1000" height="1000" key={25}/>,
            <img src={patternSquare} width="1000" height="1000" key={26}/>,
            <img src={star} width="1000" height="1000" key={27}/>,
            <img src={patternPortrait} width="1000" height="1600" key={28}/>,
            <img src={hexagon} width="1000" height="1000" key={29}/>
        ];

        let imagesPyramid;
        if(this.props.zoomedIn || this.props.zoomingIn || this.props.zoomingOut){
            imagesPyramid = (
                <Pyramid erd={this.erd} style={pyramidStyle}>
                    {images}
                </Pyramid>
            );
        } else {
            imagesPyramid = null;
        }

        return (
            <div className="demo">
                <Cover {...this.props}>Images</Cover>

                {imagesPyramid}
            </div>
        );
    }
}