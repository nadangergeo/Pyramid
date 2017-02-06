import React from "react";
import elementResizeDetector from "element-resize-detector";

import "./images.css";
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
        zoomedIn: React.PropTypes.bool
    };

    static defaultProps = { 
        zoomedIn: false
    };

    constructor(props) {
        super(props);

        // Create a elementResizeDetector.
        this.erd = props.erd || elementResizeDetector({strategy: "scroll"});
    }

    render() {
            let coverStyle = {
                position: "absolute",
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                zIndex: 500,
                display: "flex",
                height: "100%",
                overflow: "hidden",
                // backgroundColor: "#fdcb24",
                backgroundColor: "#000",
                color: "#fff",
                alignItems: "center",
                justifyContent: "center",
                opacity: 1,
                transition: "all 300ms linear"
            };

            let headerStyle = {
                display: "block",
                textAlign: "center",
                fontSize: "10vw", 
                letterSpacing: "-0.05em"
            }

            if(this.props.zoomedIn) {
                coverStyle.opacity = 0;
            }

            if(this.props.zoomedIn) {
                coverStyle.zIndex = -1000;
            }

            const wrapperStyle = {
                position: "relative",
                height: "100%",
                overflow: "hidden",
                backgroundColor: "#ccc",
            };

            const pyramidStyle = {
                height: "100%",
                backgroundColor: "#ccc",
                transition: "all 300ms linear"
            };

            let images = [
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
                <img src={hexagon} width="1000" height="1000" key={28}/>
            ]

            let imagesPyramid;
            if(this.props.zoomedIn){
                imagesPyramid = (
                    <Pyramid transition="all 300ms linear" erd={this.erd} zoomable={true} style={pyramidStyle}>
                        {images}
                    </Pyramid>
                );
            } else {
                imagesPyramid = null;
            }

            return (
                <div style={wrapperStyle}>
                    <div style={coverStyle}>
                        <h1 style={headerStyle}>Images</h1>
                    </div>

                    {imagesPyramid}
                </div>
            );
    }
}