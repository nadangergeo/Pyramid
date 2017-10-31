import React from "react";
import PropTypes from 'prop-types';
import elementResizeDetector from "element-resize-detector";

import Pyramid from "../../../../src";
import View from "../../../../src/hocs/View";

const PyramidView = View(Pyramid);

export default class Docs extends React.Component {
	static propTypes = {
		zoomable: PropTypes.bool
	};

	static defaultProps = { 
		zoomable: true
	};
	
	render() {
		return (
			<PyramidView {...this.props}>
			</PyramidView>
		);
	}
}