import React from "react";
import PropTypes from 'prop-types';
import elementResizeDetector from "element-resize-detector";

import Pyramid from "../../../../src";
import View from "../../../../src/hocs/View";

import circle from "../../img/circle.svg";
import triangle from "../../img/triangle.svg";
import square from "../../img/square.svg";
import star from "../../img/star.svg";
import hexagon from "../../img/hexagon.svg";
import patternSquare from "../../img/pattern_square.svg";
import patternPortrait from "../../img/pattern_portrait.svg";
import patternLandscape from "../../img/pattern_landscape.svg";

const PyramidView = View(Pyramid);

export default class Images extends React.Component {
	static propTypes = {
		zoomable: PropTypes.bool
	};

	static defaultProps = { 
		zoomable: true
	};
	
	render() {
		return (
			<PyramidView {...this.props}>
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
			</PyramidView>
		);
	}
}