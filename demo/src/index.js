import React from "react";
import {render} from "react-dom";
import elementResizeDetector from "element-resize-detector";

import "./index.css";
import Pyramid from "../../src";

//demos
import Giphy from "./giphy";
import Images from "./images.js";
import Cinema from "./cinema.js";
import Docs from "./docs.js";
import Gallery from "./gallery.js";

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
			<Pyramid zoomTransition="all 200ms linear" padding="0" gutter="0" numberOfColumns="1" erd={this.erd} style={pyramidStyle} zoomable={true} onElementClick={ (element, event) => console.log(element, event)}>
				<Images width="100" height="20"/>
				<Giphy width="100" height="20" themeColor="#7e00ff"/>
				<Cinema width="100" height="20" themeColor="#ff1b00" />
				<Docs width="100" height="20" themeColor="#ffba00"/>
				<Gallery width="100" height="20" themeColor="#1cbe7f"/>
			</Pyramid>
		);
	}
}

render(<Demo style="height:100%; width:100%;"/>, document.querySelector('#demo'))
