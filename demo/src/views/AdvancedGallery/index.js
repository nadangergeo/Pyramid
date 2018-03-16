import React from "react";
import PropTypes from 'prop-types';
import elementResizeDetector from "element-resize-detector";

import Pyramid from "../../../../src";
import View from "../../../../src/hocs/View";

import testImages from "../../data/testImages";
import ContainCentered from "../../../../src/hocs/ContainCentered";
import Zoomable from "../../../../src/hocs/Zoomable";
import {Media, Image, Carousel} from "../../../../src/components/Media";

const PyramidView = View(Pyramid);
const MediaCarousel = Zoomable(Carousel);

export default class AdvancedGallery extends React.Component {
	static propTypes = {
		zoomable: PropTypes.bool
	};

	static defaultProps = { 
		zoomable: true
	};

	constructor(props) {
		super(props);

		this.handleChangeIndex = this.handleChangeIndex.bind(this);
		this.data = testImages;
	}

	handleChangeIndex(index, indexLatest) {
		this.switchImage(indexLatest, index);
	}

	switchImage(from, to){
		if(from === to) {
			return;
		}

		let that = this;
		//let the dom catch some breath...
		// setTimeout(function(){
			that.refs.pyramidView.refs.pyramid.switchZoom(from, to);
		// }, 20);
	}
	
	render() {
		let carousels = [];
		if(this.props.zoomedIn){

			carousels = this.data.map((media, index) => {
				let carouselProps = {
					data: this.data,
					key: index,
					index: index,
					width: media.width,
					height: media.height,
					handleChangeIndex: this.handleChangeIndex
				}

				return <MediaCarousel {...carouselProps}/>
			});
		}

		let pyramidViewProps = {
			...this.props,
			ref: "pyramidView"
		};

		return (
			<PyramidView {...pyramidViewProps}>
				{carousels}
			</PyramidView>
		);
	}
}