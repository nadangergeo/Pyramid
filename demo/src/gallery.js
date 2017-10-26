import React from "react";
import PropTypes from 'prop-types';
import elementResizeDetector from "element-resize-detector";

import Pyramid from "../../src";
import Cover from "./cover";
import ImageViewer from "./ImageViewer";
import {
	handlePyramidDidZoomIn,
	handlePyramidDidZoomOut,
	handlePyramidWillZoomIn,
	handlePyramidWillZoomOut
} from "./commonHooks";

import circle from "./img/circle.svg";
import triangle from "./img/triangle.svg";
import square from "./img/square.svg";
import star from "./img/star.svg";
import hexagon from "./img/hexagon.svg";
import patternSquare from "./img/pattern_square.svg";
import patternPortrait from "./img/pattern_portrait.svg";
import patternLandscape from "./img/pattern_landscape.svg";

export default class Gallery extends React.Component {
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

		this.state = {
			pyramidIsZoomedIn: false,
			pyramidIsZoomedOut: true,
			pyramidIsZoomingIn: false,
			pyramidIsZoomingOut: false
		};

		this.handleKeyDown = this.handleKeyDown.bind(this);
	}

	componentWillUnmount() {
		window.removeEventListener("keydown", this.handleKeyDown.bind(this), false);
	}

	componentWillMount(){
		window.addEventListener("keydown", this.handleKeyDown.bind(this), false);
	}

	handleKeyDown(event) {
		if(this.props.zoomedIn && this.state.pyramidIsZoomedOut) {
			if(event.which === 27) { // esc
				this.props.zoomOut(event);
			}
		}
	}

	render() {
		const pyramidStyle = {
			height: "100%",
			top: 0
		};

		let pyramid;
		if(this.props.zoomedIn){
			let pyramidProps = {
				erd: this.erd,
				onDidZoomIn: handlePyramidDidZoomIn.bind(this),
				onDidZoomOut: handlePyramidDidZoomOut.bind(this),
				onWillZoomIn: handlePyramidWillZoomIn.bind(this),
				onWillZoomOut: handlePyramidWillZoomOut.bind(this),
				style: pyramidStyle,
				derenderIfNotInViewAnymore: true,
				extraPaddingTop: 100
			}

			pyramid = (
				<Pyramid {...pyramidProps}>
					<ImageViewer src={patternSquare} alt="" width="1000" height="1000"/>
					<ImageViewer src={circle} alt="" width="1000" height="1000"/>
					<ImageViewer src={patternPortrait} alt="" width="1000" height="1600"/>
					<ImageViewer src={triangle} alt="" width="1000" height="1000"/>
					<ImageViewer src={patternLandscape} alt="" width="1600" height="1000"/>
					<ImageViewer src={square} alt="" width="1000" height="1000"/>
					<ImageViewer src={patternSquare} alt="" width="1000" height="1000"/>
					<ImageViewer src={star} alt="" width="1000" height="1000"/>
					<ImageViewer src={patternPortrait} alt="" width="1000" height="1600"/>
					<ImageViewer src={hexagon} alt="" width="1000" height="1000"/>

					<ImageViewer src={patternSquare} alt="" width="1000" height="1000"/>
					<ImageViewer src={circle} alt="" width="1000" height="1000"/>
					<ImageViewer src={patternPortrait} alt="" width="1000" height="1600"/>
					<ImageViewer src={triangle} alt="" width="1000" height="1000"/>
					<ImageViewer src={patternLandscape} alt="" width="1600" height="1000"/>
					<ImageViewer src={square} alt="" width="1000" height="1000"/>
					<ImageViewer src={patternSquare} alt="" width="1000" height="1000"/>
					<ImageViewer src={star} alt="" width="1000" height="1000"/>
					<ImageViewer src={patternPortrait} alt="" width="1000" height="1600"/>
					<ImageViewer src={hexagon} alt="" width="1000" height="1000"/>
				</Pyramid>
			);
		} else {
			pyramid = null;
		}

		return (
			<div className="demo">
				<Cover {...this.props} {...this.state}>Gallery</Cover>

				{pyramid}
			</div>
		);
	}
}