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
import Gallery from "./Gallery.js";
import AdvancedGallery from "./AdvancedGallery.js";

class Demo extends React.Component {
	constructor(props) {
		super(props);

		// Create a elementResizeDetector.
		this.erd = props.erd || elementResizeDetector({strategy: "scroll"});
	}

	render() {
		const pyramidStyle = {
			height: "100%"
		};

		return (
			<Pyramid padding="0" gutter="0" numberOfColumns="1" erd={this.erd} style={pyramidStyle} zoomable={true}>
				<Images/>
				<Giphy themeColor="#7e00ff"/>
				<Cinema themeColor="#ff1b00" />
				<Docs themeColor="#ffba00"/>
				<Gallery themeColor="#12b886"/>
				<AdvancedGallery themeColor="#4c6ef5"/>
			</Pyramid>
		);
	}
}

render(<Demo style="height:100%; width:100%;"/>, document.querySelector('#demo'))
