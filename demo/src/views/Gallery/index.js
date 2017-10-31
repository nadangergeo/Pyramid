import React from "react";
import PropTypes from 'prop-types';
import elementResizeDetector from "element-resize-detector";

import Pyramid from "../../../../src";
import View from "../../../../src/hocs/View";
import ImageViewer from "../../../../src/components/ImageViewer";

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
			</PyramidView>
		);
	}
}