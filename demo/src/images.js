import React from "react";
import elementResizeDetector from "element-resize-detector";

import "./images.css";
import ImageViewer from "./imageViewer";
import Pyramid from "../../src";

import circle from "./img/circle.png";
import triangle from "./img/triangle.png";
import square from "./img/square.png";
import star from "./img/star.png";
import hexagon from "./img/hexagon.png";
import patternSquare from "./img/pattern_square.png";
import patternPortrait from "./img/pattern_portrait.png";
import patternLandscape from "./img/pattern_landscape.png";

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

        // Close button
        // ------------------------------------------------------------------------

        let closeButtonStyle = Object.assign({}, this.styleNormalizer);
        closeButtonStyle = {
            display: "block",
            padding: "10px",
            position: "fixed",
            zIndex: 1000,
            top: "30px",
            left: "20px",
            fill: "white",
            backgroundColor: "black",
            opacity: this.props.zoomedIn ? 1 : 0,
            transition: "opacity 200ms linear"
        }

        let closeButton = this.props.zoomingIn || this.props.zoomedIn ? (
            <div style={closeButtonStyle} onClick={this.props.zoomOut}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </div>
        ) : null;

        let pyramidStyle = {
            height: "calc(100% - 120px)",
            top: "120px",
        };

        let coverStyle = {
            height: this.props.zoomedIn || this.props.zoomingIn ? "120px" : "100%",
        };

        let headerStyle = {
            fontSize: this.props.zoomedIn || this.props.zoomingIn ? "3em" : null,
        }

        let images = [
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
        ]

        // images = images.map((img, index) => {
        //     return (<ImageViewer key={index}>{img}</ImageViewer>)
        // });

        let imagesPyramid;
        if(this.props.zoomedIn || this.props.zoomingIn || this.props.zoomingOut){
            imagesPyramid = (
                <Pyramid erd={this.erd} zoomable={true} style={pyramidStyle}>
                    {images}
                </Pyramid>
            );
        } else {
            imagesPyramid = null;
        }

        return (
            <div className="demo">
                {closeButton}

                <div className="demo__cover" style={coverStyle}>
                    <h1 className="demo__header" style={headerStyle}>Images</h1>
                </div>

                {imagesPyramid}
            </div>
        );
    }
}