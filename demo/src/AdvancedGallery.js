import React from "react";
import PropTypes from 'prop-types';
import elementResizeDetector from "element-resize-detector";

import Pyramid from "../../src";
import Cover from "./cover";
import {
	handlePyramidDidZoomIn,
	handlePyramidDidZoomOut,
	handlePyramidWillZoomIn,
	handlePyramidWillZoomOut
} from "./commonHooks";

import testImages from "./data/testImages";
import ContainCentered from "./ContainCentered";
import Zoomable from "./Zoomable";
import {Media, Image, Carousel} from "./Media";

const MediaCarousel = Zoomable(Carousel); //ContainCentered kanske inte behövs här?

export default class AdvancedGallery extends React.Component {
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
		this.handleChangeIndex = this.handleChangeIndex.bind(this);
		this.data = testImages;
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

	handleChangeIndex(index, indexLatest) {
		this.switchImage(indexLatest, index);
	}

	switchImage(from, to){
		if(from === to) {
			return;
		}

		let that = this;
		//let the dom catch some breath...
		setTimeout(function(){
			that.refs.pyramid.switchZoom(from, to);
		}, 50);
	}

	render() {
		const pyramidStyle = {
			height: "100%"
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
				extraPaddingTop: 100,
				ref: "pyramid"
			}

			let carousels = this.data.map((media, index) => {
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

			pyramid = (
				<Pyramid {...pyramidProps}>
					{carousels}
				</Pyramid>
			);
		} else {
			pyramid = null;
		}

		return (
			<div className="demo">
				<Cover {...this.props} {...this.state}>Advanced Gallery</Cover>

				{pyramid}
			</div>
		);
	}
}