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
            <Giphy key="0" width={"100"} height="100" zoomedIn={false} />,
            <Images key="1" width={"100"} height="100" zoomedIn={false} />
            // ,<SpongeBob key="2" width={"100"} height="100" zoomedIn={false} />
        ];

        let numberOfColumns = {
            default: 2
        };

        return (
            <Pyramid transition="all 300ms linear" numberOfColumns={numberOfColumns} erd={this.erd} style={pyramidStyle} zoomable={true} onElementClick={ (element, event) => console.log(element, event)}>
                {demos}
            </Pyramid>
        );
    }
}

render(<Demo style="height:100%; width:100%;"/>, document.querySelector('#demo'))
