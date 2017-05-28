import React from "react";
import elementResizeDetector from "element-resize-detector";

import "./cinema.css";
import CloseButton from "./closeButton";
import Cover from "./cover";

export default class Cinema extends React.Component {
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

        let pyramidStyle = {
            height: "100%"
        };

        return (
            <div className="demo">
                <CloseButton {...this.props}/>
                <Cover {...this.props}>Cinema</Cover>
            </div>
        );
    }
}