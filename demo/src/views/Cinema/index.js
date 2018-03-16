import React from "react";
import PropTypes from 'prop-types';
import elementResizeDetector from "element-resize-detector";

import Pyramid from "../../../../src";
import View from "../../../../src/hocs/View";
import Film from "../../components/Film";
import filmsData from "../../data/films";

const PyramidView = View(Pyramid);

export default class Cinema extends React.Component {
	static propTypes = {
		zoomable: PropTypes.bool
	};

	static defaultProps = { 
		zoomable: true
	};

	render() {
		const films = filmsData.map( (data, index) => {
			return (<Film data={data} key={index} themeColor={this.props.themeColor} />);
		});

		return (
			<PyramidView {...this.props}>
				{films}
			</PyramidView>
		);
	}
}