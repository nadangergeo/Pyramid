import React from "react";
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { mod } from 'react-swipeable-views-core';
import ContainCentered from "../../../src/hocs/ContainCentered";

export default class Media extends React.PureComponent {
	static propTypes = {
		type: PropTypes.oneOf(["img", "video", "audio", "object", "iframe"]).isRequired,
		width: PropTypes.oneOfType([
					PropTypes.string,
					PropTypes.number
				]).isRequired,
		height: PropTypes.oneOfType([
					PropTypes.string,
					PropTypes.number
				]).isRequired
	};

	constructor(props) {
		super(props);

		this.state = {
			loaded: false
		}
	}

	handleMediaLoaded() {
		// console.log("loaded! wohooO!");
		this.setState(
			{ loaded : true }
		);

		if(this.props.onLoad) {
			this.props.onLoad();
		}
	}

	render() {
		let wrappedComponentWidth = this.props.width === "auto" ? "auto" : parseInt(this.props.width, 10);
		let wrappedComponentHeight = this.props.height === "auto" ? "auto" : parseInt(this.props.height, 10);

		let containerStyle = {
			width: this.props.containerWidth,
			height: this.props.zoomingIn || this.props.zoomedIn ? "auto" : ((parseInt(this.props.height, 10) / parseInt(this.props.width, 10)) * this.props.containerWidth) + "px",
			opacity: this.props.inView && this.state.loaded ? 1 : 0,
			transition: this.props.transitions ? this.props.transitions.join(",") : this.props.zoomTransition || null,
			/*lineHeight: 0, not needed anymore?*/
			willChange: "width, height, opacity",
			transform: "translateZ(0)"
		};

		let wrappedComponentProps = {
			src: this.props.src,
			onLoad: this.handleMediaLoaded.bind(this),
			style: {
				width: "100%",
				height: "auto"
				// height: !this.state.loaded && this.props.height !== "auto" && this.props.width !== "auto" ? ((this.props.containerWidth / wrappedComponentWidth) * wrappedComponentHeight) + "px" : "auto"
			}
		};

		let wrappedComp = React.createElement(
		  this.props.type,
		  ...wrappedComponentProps
		);

		return(
			<div style={containerStyle}>
				{this.props.inView ? wrappedComp : null}
			</div>
		);
	}
}

export class Image extends React.Component {
	render() {
		return (<Media type="img" {...this.props} />);
	}
}

const MediaCarouselSlice = ContainCentered(Media);

export class Carousel extends React.Component {
	static propTypes = {
		index: PropTypes.number
	};

	static defaultProps = { 
		index: 0
	};

	constructor(props) {
		super(props);

		this.state = {
			index: this.props.index,
			indexLatest: this.props.index,
			loaded: false,
			numOfloaded: 0
		}

		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.handleLoaded = this.handleLoaded.bind(this);
		// this.handleChangeIndex = this.handleChangeIndex.bind(this);
	}

	componentWillUnmount() {
		window.removeEventListener("keydown", this.handleKeyDown, false);
	}

	componentWillMount(){
		window.addEventListener("keydown", this.handleKeyDown, false);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			index: nextProps.index
		});

		if(nextProps.zoomingOut) {
			this.setState({
				loaded: false,
				numOfloaded: 0
			});
		}
	}

	handleKeyDown(event) {
		if(this.props.zoomedIn) {
			if(event.which === 37) { // left
				this.setState({
					index: this.state.index - 1 < 0 ? 0 : this.state.index - 1
				});
			}
			else if(event.which === 39) { // right
				this.setState({
					index: this.state.index + 1 === this.props.data.length ? this.props.data.length - 1 : (this.state.index + 1) % this.props.data.length
				});
			}
		}
	}

	handleChangeIndex(index, indexLatest) {
		this.setState({
			index: index,
			indexLatest
		});
	}

	handleTransitionEnd() {
		if(this.props.handleChangeIndex){
			this.props.handleChangeIndex(this.state.index, this.state.indexLatest);
		}
	}

	handleLoaded() {
		let that = this;
		let currentIndex = this.state.index;

		let toBeLoaded = 4;
		if(currentIndex === 0 || currentIndex === this.props.data.length - 1) {
			toBeLoaded = 3;
		}

		if(this.state.numOfloaded + 1 === toBeLoaded) {
			this.setState({
				loaded: true,
				numOfloaded: this.state.numOfloaded + 1
			});
		} else {
			this.setState({
				numOfloaded: this.state.numOfloaded + 1
			});
		}

		if(this.props.onLoad) {
			this.props.onLoad();
		}
	}

	getCarouselSlices(cover = false) {
		let transitions = [];
		let currentIndex = this.state.index;

		if(cover) {
			transitions.push(this.props.zoomTransition);
		} else {
			transitions.push("opacity 0ms linear");
		};

		let data = this.props.data;
		if(cover) {
			data = [data[currentIndex]];
		}

		return data.map((media, index) => {
			let sliceProps = {
				...this.props,
				...media,
				type: media.type || "img",
				inView: cover ? this.props.inView : Math.abs(currentIndex - index) < 2,
				key: index,
				index: index,
				onLoad: this.handleLoaded,
				transitions: transitions
			};

			return <MediaCarouselSlice {...sliceProps}/>
		});
	}

	render() {
		const swipeableViewsStyle = {
			position: "absolute",
			top: 0,
			left: 0,
			zIndex: 50,
			width: "100%",
			height: "100%",
			transition: "opacity 60ms linear",
			opacity: (this.props.zoomedIn && this.state.loaded) ? 1 : 0,
			backgroundColor: "black"
		}

		const containerStyle = {
			position: "relative",
			width: "100%",
			height: "100%"
		};

		const cover = this.getCarouselSlices(true);
		const children = this.getCarouselSlices(false);

		return (
			<div style={containerStyle}>
				{cover}

				{(this.props.zoomedIn) && //TODO: should not render during zoomingIn!
					<SwipeableViews resistance index={mod(this.state.index, children.length)} onTransitionEnd={this.handleTransitionEnd.bind(this)} onChangeIndex={this.handleChangeIndex.bind(this)} enableMouseEvents style={swipeableViewsStyle} containerStyle={containerStyle}>
						{children}
					</SwipeableViews>
				}
			</div>
		);
	}
}