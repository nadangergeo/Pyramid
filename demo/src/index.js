import React from "react";
import {render} from "react-dom";
import elementResizeDetector from "element-resize-detector";

import "./index.css";
import Pyramid from "../../src";

//demos
import Giphy from "./views/Giphy";
import Images from "./views/Images";
import Cinema from "./views/Cinema";
import Docs from "./views/Docs";
import Gallery from "./views/Gallery";
import AdvancedGallery from "./views/AdvancedGallery";

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
			<Pyramid padding="0" gutter="0" numberOfColumns="1" erd={this.erd} style={pyramidStyle}>
				<Images title="Images"/>
				<Giphy title="Giphy" themeColor="#7e00ff"/>
				<Cinema themeColor="#ff1b00" />
				<Docs title="Docs" themeColor="#ffba00"/>
				<Gallery title="Gallery" themeColor="#12b886"/>
				<AdvancedGallery title="Advanced Gallery" themeColor="#4c6ef5"/>
			</Pyramid>
		);
	}
}

render(<Demo style="height:100%; width:100%;"/>, document.querySelector('#demo'))
