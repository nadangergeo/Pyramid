import React from "react";
import {render} from "react-dom";
import elementResizeDetector from "element-resize-detector";

import "./index.css";
import Pyramid from "../../src";

//demos
import Giphy from "./giphy";
import Images from "./images.js";
import Cinema from "./cinema.js";

class Demo extends React.Component {
    constructor(props) {
        super(props);

        // Create a elementResizeDetector.
        this.erd = props.erd || elementResizeDetector({strategy: "scroll"});

        this.state = {
            zoomedIn: false
        }
    }

    render() {
        const pyramidStyle = {
            height: "100%"
        };

        return (
            <Pyramid zoomTransition="all 200ms linear" padding="0" gutter="5" numberOfColumns="1" erd={this.erd} style={pyramidStyle} zoomable={true} onElementClick={ (element, event) => console.log(element, event)}>
                <Images width={"100"} height="20"/>
                <Giphy width={"100"} height="20"/>
                <Cinema width={"100"} height="20"/>
            </Pyramid>
        );
    }
}

render(<Demo style="height:100%; width:100%;"/>, document.querySelector('#demo'))
