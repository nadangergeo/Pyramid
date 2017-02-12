import React from "react";
import {render} from "react-dom";
import elementResizeDetector from "element-resize-detector";

import "./index.css";
import Pyramid from "../../src";

//demos
import Giphy from "./giphy";
import Images from "./images.js";

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

        let demos = [
            <Giphy key="0" width={"100"} height="100" zoomedIn={true} />,
            <Images key="1" width={"100"} height="100" zoomedIn={true} />
        ];

        let numberOfColumns = {
            default: 2
        };

        return (
            <Pyramid transition="all 200ms cubic-bezier(.63,-0.43,.33,1.41)" numberOfColumns={numberOfColumns} erd={this.erd} style={pyramidStyle} zoomable={true} onElementClick={ (element, event) => console.log(element, event)}>
                {demos}
            </Pyramid>
        );

        // return demos[1];
    }
}

render(<Demo style="height:100%; width:100%;"/>, document.querySelector('#demo'))
