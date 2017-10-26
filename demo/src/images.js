import React from "react";
import PropTypes from 'prop-types';
import elementResizeDetector from "element-resize-detector";

import Pyramid from "../../src";
import Cover from "./cover";

import circle from "./img/circle.svg";
import triangle from "./img/triangle.svg";
import square from "./img/square.svg";
import star from "./img/star.svg";
import hexagon from "./img/hexagon.svg";
import patternSquare from "./img/pattern_square.svg";
import patternPortrait from "./img/pattern_portrait.svg";
import patternLandscape from "./img/pattern_landscape.svg";

export default class Images extends React.Component {
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
	}

	render() {

		const pyramidStyle = {
			height: "calc(100% - 100px)",
			top: "100px",
		};

		let imagesPyramid;
		if(this.props.zoomedIn || this.props.zoomingIn || this.props.zoomingOut){
			imagesPyramid = (
				<Pyramid erd={this.erd} style={pyramidStyle}>
					<p style={{padding:"20px", backgroundColor: "black", color: "white", lineHeight: "1.4"}}>
						This is a simple demo with images (and this paragraph with unknown height). Lorem ipsum dolor sit amet. Morbi a enim in magna semper bibendum. Etiam scelerisque, nunc ac egestas consequat, odio nibh euismod nulla, eget auctor orci nibh vel.
					</p>

					<img src={patternSquare} width="1000" height="1000"/>
					<img src={circle} width="1000" height="1000"/>
					<img src={patternPortrait} width="1000" height="1600"/>
					<img src={triangle} width="1000" height="1000"/>
					<img src={patternLandscape} width="1600" height="1000"/>
					<img src={square} width="1000" height="1000"/>
					<img src={patternSquare} width="1000" height="1000"/>
					<img src={star} width="1000" height="1000"/>
					<img src={patternPortrait} width="1000" height="1600"/>
					<img src={hexagon} width="1000" height="1000"/>

					<img src={patternSquare} width="1000" height="1000"/>
					<img src={circle} width="1000" height="1000"/>
					<img src={patternPortrait} width="1000" height="1600"/>
					<img src={triangle} width="1000" height="1000"/>
					<img src={patternLandscape} width="1600" height="1000"/>
					<img src={square} width="1000" height="1000"/>
					<img src={patternSquare} width="1000" height="1000"/>
					<img src={star} width="1000" height="1000"/>
					<img src={patternPortrait} width="1000" height="1600"/>
					<img src={hexagon} width="1000" height="1000"/>

					<img src={patternSquare} width="1000" height="1000"/>
					<img src={circle} width="1000" height="1000"/>
					<img src={patternPortrait} width="1000" height="1600"/>
					<img src={triangle} width="1000" height="1000"/>
					<img src={patternLandscape} width="1600" height="1000"/>
					<img src={square} width="1000" height="1000"/>
					<img src={patternSquare} width="1000" height="1000"/>
					<img src={star} width="1000" height="1000"/>
					<img src={patternPortrait} width="1000" height="1600"/>
					<img src={hexagon} width="1000" height="1000"/>
				</Pyramid>
			);
		} else {
			imagesPyramid = null;
		}

		return (
			<div className="demo">
				<Cover {...this.props}>Images</Cover>

				{imagesPyramid}
			</div>
		);
	}
}