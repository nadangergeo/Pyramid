import React from "react";
import PropTypes from 'prop-types';
import elementResizeDetector from "element-resize-detector";

import Pyramid from "../../../../src";
import Cover from "../../../../src/components/Cover";
import Film from "../../components/Film";
import films from "../../data/films";

export default class Cinema extends React.Component {
	static propTypes = {
		zoomable: PropTypes.bool
	};

	static defaultProps = { 
		zoomable: true
	};

	constructor(props) {
		super(props);

		// Create a elementResizeDetector.
		this.erd = props.erd || elementResizeDetector({strategy: "scroll"});

		this.filmsData = films;
	}

	render() {

		const pyramidStyle = {
			height: "calc(100% - 100px)",
			top: "100px",
			zIndex: 1000,
			// height: "100%",
			// position: "static"
		};

		const films = this.filmsData.map( (data, index) => {
			return (<Film data={data} key={index} themeColor={this.props.themeColor} />);
		});

		let filmsPyramid;
		if(this.props.zoomedIn || this.props.zoomingIn || this.props.zoomingOut) {
			filmsPyramid = (
				<Pyramid erd={this.erd} style={pyramidStyle} extraPaddingTop="0">
					{films}
				</Pyramid>
			);
		} else {
			filmsPyramid = null;
		}

		return (
			<div className="demo">
				<Cover {...this.props} zIndex={!this.props.zoomedOut ? 2000 : 100}>Cinema</Cover>
				{filmsPyramid}
			</div>
		);
	}
}