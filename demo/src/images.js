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
            let demoStyle = {},
                 coverStyle = {},
                 headerStyle = {};

            if(this.props.zoomedIn) {
                coverStyle.opacity = 0;
                coverStyle.zIndex = -1000;
            }

            let pyramidStyle = {
                height: "100%",
                backgroundColor: "#ccc"
            };

            let images = [
                <p style={{padding:"20px", backgroundColor: "black", color: "white"}} key={30}>Maecenas quis tortor arcu. Vivamus rutrum nunc non neque consectetur quis placerat neque lobortis. Nam vestibulum, arcu sodales feugiat consectetur, nisl orci bibendum elit, eu.</p>,

                <img center src={patternSquare} width="1000" height="1000" key={0}/>,
                <img center src={circle} width="1000" height="1000" key={1}/>,
                <img center src={patternPortrait} width="1000" height="1600" key={2}/>,
                <img center src={triangle} width="1000" height="1000" key={3}/>,
                <img center src={patternLandscape} width="1600" height="1000" key={4}/>,
                <img center src={square} width="1000" height="1000" key={5}/>,
                <img center src={patternSquare} width="1000" height="1000" key={6}/>,
                <img center src={star} width="1000" height="1000" key={7}/>,
                <img center src={patternPortrait} width="1000" height="1600" key={8}/>,
                <img center src={hexagon} width="1000" height="1000" key={9}/>,
                // repeat
                <img center src={patternSquare} width="1000" height="1000" key={10}/>,
                <img center src={circle} width="1000" height="1000" key={11}/>,
                <img center src={patternPortrait} width="1000" height="1600" key={12}/>,
                <img center src={triangle} width="1000" height="1000" key={13}/>,
                <img center src={patternLandscape} width="1600" height="1000" key={14}/>,
                <img center src={square} width="1000" height="1000" key={15}/>,
                <img center src={patternSquare} width="1000" height="1000" key={16}/>,
                <img center src={star} width="1000" height="1000" key={17}/>,
                <img center src={patternPortrait} width="1000" height="1600" key={18}/>,
                <img center src={hexagon} width="1000" height="1000" key={19}/>,
                // repeat
                <img center src={patternSquare} width="1000" height="1000" key={20}/>,
                <img center src={circle} width="1000" height="1000" key={21}/>,
                <img center src={patternPortrait} width="1000" height="1600" key={22}/>,
                <img center src={triangle} width="1000" height="1000" key={23}/>,
                <img center src={patternLandscape} width="1600" height="1000" key={24}/>,
                <img center src={square} width="1000" height="1000" key={25}/>,
                <img center src={patternSquare} width="1000" height="1000" key={26}/>,
                <img center src={star} width="1000" height="1000" key={27}/>,
                <img center src={patternPortrait} width="1000" height="1600" key={28}/>,
                <img center src={hexagon} width="1000" height="1000" key={29}/>
            ]

            let imagesPyramid;
            if(this.props.zoomedIn || this.props.zoomingIn || this.props.zoomingOut){
                imagesPyramid = (
                    <Pyramid transition="all 200ms cubic-bezier(.63,-0.43,.33,1.41)" erd={this.erd} zoomable={true} style={pyramidStyle}>
                        {images}
                    </Pyramid>
                );
            } else {
                imagesPyramid = null;
            }

            return (
                <div className="demo" style={demoStyle}>
                    <div className="demo__cover" style={coverStyle}>
                        <h1 className="demo__header" style={headerStyle}>Images</h1>
                    </div>

                    {imagesPyramid}
                </div>
            );
    }
}