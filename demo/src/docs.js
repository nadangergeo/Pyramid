import React from "react";
import elementResizeDetector from "element-resize-detector";

import Pyramid from "../../src";
import Cover from "./cover";

export default class Docs extends React.Component {
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

		return (
			<div className="demo">
				<Cover {...this.props}>Docs</Cover>
			</div>
		);
	}
}