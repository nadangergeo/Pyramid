import React from "react";
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import CloseButton from "./closeButton";

export default class SwipeableImages extends React.PureComponent {
	static propTypes = {
		zoomable: PropTypes.bool,
		inView: PropTypes.bool,
		index: PropTypes.number
	};

	static defaultProps = { 
		zoomable: true,
		inView: true,
		index: 0
	};

	constructor(props) {
		super(props);

		this.state = {
			imagesZoomedIn: {},
			loaded: false,
			index: props.index
		}

		this.styleNormalizer = {
			margin: 0,
			padding: 0,
			border: 0,
		};

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleImageLoaded = this.handleImageLoaded.bind(this);
		this.handleChangeIndex = this.handleChangeIndex.bind(this);
	}

	componentWillUpdate(nextProps, nextState) {
		if(nextProps.zoomedOut) {
			this.setState({
				index: this.props.index
			});
		}
	}

	componentWillUnmount() {
		window.removeEventListener("keydown", this.handleKeyDown, false);
	}

	componentWillMount(){
		window.addEventListener("keydown", this.handleKeyDown, false);
	}

	handleKeyDown(event) {
		if(event.which === 27) { // left
			this.props.zoomOut(event);
		}
		else if(event.which === 37) { // left
			this.setState({
				index: this.state.index - 1 < 0 ? this.props.children.length - 1 : this.state.index - 1
			});
		}
		else if(event.which === 39) { // right
			this.setState({
				index: this.state.index + 1 % this.props.children.length
			});
		}
	}

	handleImageLoaded() {
		this.setState(
			{ loaded : true }
		);
	}

	handleChangeIndex(index, indexLatest) {
		this.setState({
			index
		});
	}

	zoomInImage(index) {
		return null; //NEIN!

		// let imagesZoomedIn = Object.assign({}, this.state.imagesZoomedIn);
		// imagesZoomedIn[index] = !this.state.imagesZoomedIn[index];

		// this.setState({
		// 	imagesZoomedIn
		// });
	}

	aspectRatioImage(image, index) {
		let containerWidth = this.props.containerWidth;
		let containerHeight = this.props.containerHeight;
		let height, width;

		if((containerWidth >= containerHeight && !this.state.imagesZoomedIn[index]) || (containerWidth < containerHeight && this.state.imagesZoomedIn[index]))  {
			width = "auto";
			height = containerHeight + "px";
		} else if((containerWidth < containerHeight && !this.state.imagesZoomedIn[index]) || (containerWidth >= containerHeight && this.state.imagesZoomedIn[index])) {
			width = containerWidth + "px";
			height = "auto";
		}
		
		const containerStyle = {
			width: "100%",
			height: "100%",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			// cursor: this.state.imagesZoomedIn[index] ? "zoom-out" : "zoom-in",
			overflow: "hidden"
		};

		const imageStyle = {
			width: width,
			height: height,
			transition: "all 300ms linear"
		};

		let imageProps = {
			style: imageStyle,
			width: null,
			height: null,
		}

		let imageElement = React.cloneElement(image, imageProps);

		return (
			<div key={index} style={containerStyle} onClick={this.zoomInImage.bind(this, index)}>
				{imageElement}
			</div>
		)
	}

	render() {
		let image = this.props.children[this.props.index];
		let containerWidth = this.props.containerWidth;

		// Swipable Images
		// ------------------------------------------------------------------------

		let swipeableImagesStyle = Object.assign({}, this.styleNormalizer);
		swipeableImagesStyle = Object.assign(swipeableImagesStyle, {
			display: "flex",
			backgroundColor: this.props.zoomedIn || this.props.zoomingIn || this.props.zoomingOut ? "black" : "rgba(0,0,0,0.1)",
			width: "100%",
			height: this.props.zoomedIn || this.props.zoomingIn ||  this.props.zoomingOut ? "100%" : "auto",
			transition: "backgroundColor 300ms linear"
		});

		// Image
		// ------------------------------------------------------------------------

		let imageContainerStyle = {
			position: "relative",
			margin: "auto",
			width: "100%",
			height: ((image.props.height / image.props.width) * containerWidth) + "px",
			cursor: this.props.zoomedOut ? "pointer" : "auto",
			opacity: this.props.inView && this.state.loaded ? 1 : 0,
			transition: "opacity 200ms linear"
		}

		let imageStyle = Object.assign({}, this.styleNormalizer);
		imageStyle = Object.assign(imageStyle, {
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "auto",
			boxSizing: "border-box",
		});

		let imageProps = {
			style: imageStyle,
			onLoad: this.handleImageLoaded,
			width: null,
			height: null
		}

		image = React.cloneElement(image, imageProps);

		let aspectRatioImage = this.aspectRatioImage(image, this.props.index);

		// Slider
		// ------------------------------------------------------------------------

		// Let's start by doing some necessary checks
		let images = this.props.children.filter( image => {
			if(!image.props.width || !image.props.height) {
				throw new Error("The original width and height of an image should be supplied. This is because the component needs to calculate the aspect ratio before the media has loaded.");
			} else {
				return true;
			}
		});

		images = images.map((image, index) => {
			return this.aspectRatioImage(image, index);
		});

		const swipeableViewsStyle = {
			position: "absolute",
			top: 0,
			left: 0,
			zIndex: 50,
			width: "100%",
			height: "100%",
			display: this.props.zoomedIn ? "block" : "none"
		}

		const containerStyle = {
			width: "100%",
			height: "100%"
		};

		const swipeableView = (
			<SwipeableViews onChangeIndex={this.handleChangeIndex} index={this.state.index} enableMouseEvents style={swipeableViewsStyle} containerStyle={containerStyle}>
				{images}
			</SwipeableViews>
		);

		// ------------------------------------------------------------------------

		return(
			<div style={swipeableImagesStyle} onClick={this.props.zoomIn} onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut}>
				<CloseButton {...this.props} position="fixed"/>

				{this.props.inView && this.props.zoomedOut ? <div style={imageContainerStyle}>{ image }</div> : ""}

				{this.props.inView && (this.props.zoomingIn || this.props.zoomingOut) ? aspectRatioImage: ""}

				{this.props.inView && this.props.zoomedIn ? swipeableView: ""}
			</div>
		);
	}
}