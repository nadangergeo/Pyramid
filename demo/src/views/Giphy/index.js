import React from "react";
import PropTypes from 'prop-types';
import elementResizeDetector from "element-resize-detector";

import Pyramid from "../../../../src";
import View from "../../../../src/hocs/View";
import GifViewer from "../../../../src/components/GifViewer";
import {
	handlePyramidDidZoomIn,
	handlePyramidDidZoomOut,
	handlePyramidWillZoomIn,
	handlePyramidWillZoomOut
} from "../../../../src/utils";

const PyramidView = View(Pyramid);

export default class Giphy extends React.Component {
	static propTypes = {
		zoomable: PropTypes.bool
	};

	static defaultProps = { 
		zoomable: true
	};

	constructor(props) {
		super(props);

		this.state = {
			gifs: [],
		}

		this.defaultSearch = "trippy";
		this.handleSearch = this.handleSearch.bind(this);
		this.handleSearchClick = this.handleSearchClick.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.zoomingIn) {
			this.search(this.defaultSearch);
			// this.refs.input.focus();
		}
	}

	componentDidUpdate(prevProps, nextProps) {
		if(nextProps.zoomedIn) {
			this.refs.input.focus();
		}
	}

	handleSearch(event) {
		this.search(event.target.value);
	}

	handleSearchClick(event) {
		event.stopPropagation();
	}

	search(searchQuery) {
		var _this = this;

		//fetch gifs from giphy
		fetch("http://api.giphy.com/v1/gifs/search?q=" + searchQuery + "&limit=100&api_key=dc6zaTOxFJmzC")
		.then(response => response.json())
		.then(json => {
			let data = json.data;
			let gifs = data.map(gif => {
				let image = gif.images.downsized;
				// let still = gif.images.fixed_width_downsampled;
				let still = gif.images.downsized_still;

				return {
					id: gif.id,
					src: image.url,
					stillSrc: still.url,
					width: image.width,
					height: image.height
				}
			});

			return gifs;

		}).then(gifs =>{
			//some objects returned by giphy have no src property.
			//we need to filter
			return gifs.filter( gif => {
				if(!gif.src || gif.src === "") {
					return false;
				}

				return true;
			});
		}).then(gifs => {
			_this.setState({
				gifs: gifs
			});
		});
	}

	getGifViewers() {
		return this.state.gifs.map( (gif, index) => {
			return (				
				<GifViewer key={gif.id} gif={gif}/>
			);
		});
	}
	
	render() {
		let inputContainerStyle = {
			transform: "translateY(" + (this.props.zoomedIn && !(this.state.pyramidIsZoomingIn || this.state.pyramidIsZoomedIn) ? "0" : "120px") + ")",
			opacity: this.props.zoomedIn && !(this.state.pyramidIsZoomingIn || this.state.pyramidIsZoomedIn) ? 1 : 0,
			position: "fixed",
			bottom: "0",
			width: "100%",
			height: "100px",
			paddingBottom: "0",
			boxSizing: "border-box",
			zIndex: "100",
			boxShadow: "0 -1px 10px rgba(0, 0, 0, 0.3)",
			transition: this.props.zoomTransition
		}

		let inputStyle = {
			width: "100%",
			height: "100%",
			padding: "20px 40px",
			border: "none",
			outline: "none",
			background: "white",
			color: "#444",
			fontSize: "1.5em",
			fontWeight: "bold",
			letterSpacing: "-0.02em",
			MozAppearance: "none",
			WebkitAppearance: "none",
			WebkitBorderRadius: "0px",
			borderRadius: "0px"
		};	

		let getGifViewers = this.getGifViewers();

		let pyramidProps = {
			...this.props,
			onDidZoomIn: handlePyramidDidZoomIn.bind(this),
			onDidZoomOut: handlePyramidDidZoomOut.bind(this),
			onWillZoomIn: handlePyramidWillZoomIn.bind(this),
			onWillZoomOut: handlePyramidWillZoomOut.bind(this),
			extraPaddingBottom: 100,
			numberOfColumns: {
				default: 1,
				breakpoints: {
					"768px"  : 2,
					"1024px" : 3,
					"1280px" : 4
				}
			}
		}

		return (
			<div style={{height:"100%"}}>
				<PyramidView {...pyramidProps}>
					{getGifViewers}
				</PyramidView>

				<div className="input-container" style={inputContainerStyle}>
					<input ref="input" type="search" style={inputStyle} placeholder="Search Giphy…" onChange={this.handleSearch} onClick={this.handleSearchClick} />
				</div>
			</div>
		);
	}
}