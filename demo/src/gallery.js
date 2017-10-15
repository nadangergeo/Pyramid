import React from "react";
import PropTypes from 'prop-types';
import elementResizeDetector from "element-resize-detector";

import Pyramid from "../../src";
import SwipeableImages from "./SwipeableImages";
import Cover from "./cover";

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

		this.images = [
			<img key={0} src={patternSquare} alt="" width="1000" height="1000"/>,
			<img key={1} src={circle} alt="" width="1000" height="1000"/>,
			<img key={2} src={patternPortrait} alt="" width="1000" height="1600"/>,
			<img key={3} src={triangle} alt="" width="1000" height="1000"/>,
			<img key={4} src={patternLandscape} alt="" width="1600" height="1000"/>,
			<img key={5} src={square} alt="" width="1000" height="1000"/>,
			<img key={6} src={patternSquare} alt="" width="1000" height="1000"/>,
			<img key={7} src={star} alt="" width="1000" height="1000"/>,
			<img key={8} src={patternPortrait} alt="" width="1000" height="1600"/>,
			<img key={9} src={hexagon} alt="" width="1000" height="1000"/>,

			<img key={10} src={patternSquare} alt="" width="1000" height="1000"/>,
			<img key={11} src={circle} alt="" width="1000" height="1000"/>,
			<img key={12} src={patternPortrait} alt="" width="1000" height="1600"/>,
			<img key={13} src={triangle} alt="" width="1000" height="1000"/>,
			<img key={14} src={patternLandscape} alt="" width="1600" height="1000"/>,
			<img key={15} src={square} alt="" width="1000" height="1000"/>,
			<img key={16} src={patternSquare} alt="" width="1000" height="1000"/>,
			<img key={17} src={star} alt="" width="1000" height="1000"/>,
			<img key={18} src={patternPortrait} alt="" width="1000" height="1600"/>,
			<img key={19} src={hexagon} alt="" width="1000" height="1000"/>,

			<img key={20} src={patternSquare} alt="" width="1000" height="1000"/>,
			<img key={21} src={circle} alt="" width="1000" height="1000"/>,
			<img key={22} src={patternPortrait} alt="" width="1000" height="1600"/>,
			<img key={23} src={triangle} alt="" width="1000" height="1000"/>,
			<img key={24} src={patternLandscape} alt="" width="1600" height="1000"/>,
			<img key={25} src={square} alt="" width="1000" height="1000"/>,
			<img key={26} src={patternSquare} alt="" width="1000" height="1000"/>,
			<img key={27} src={star} alt="" width="1000" height="1000"/>,
			<img key={28} src={patternPortrait} alt="" width="1000" height="1600"/>,
			<img key={29} src={hexagon} alt="" width="1000" height="1000"/>
		];

		this.swipeableImages = this.images.map((image, index) => {
			return (
				<SwipeableImages key={index} index={index}>
					{this.images}
				</SwipeableImages>
			);
		});
	}

	render() {

		const pyramidStyle = {
			height: "calc(100% - 100px)",
			top: "100px",
		};

		let galleryPyramid;
		if(this.props.zoomedIn || this.props.zoomingIn || this.props.zoomingOut){
			galleryPyramid = (
				<Pyramid erd={this.erd} style={pyramidStyle}>
					{this.swipeableImages}
				</Pyramid>
			);
		} else {
			galleryPyramid = null;
		}

		return (
			<div className="demo">
				<Cover {...this.props}>Gallery</Cover>

				{galleryPyramid}
			</div>
		);
	}
}