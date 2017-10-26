import React from "react";
import PropTypes from 'prop-types';
import elementResizeDetector from "element-resize-detector";

import "./giphy.css";
import Pyramid from "../../src";
import Cover from "./cover";
import GifViewer from "./GifViewer";
import {
	handlePyramidDidZoomIn,
	handlePyramidDidZoomOut,
	handlePyramidWillZoomIn,
	handlePyramidWillZoomOut
} from "./commonHooks";

export default class Giphy extends React.Component {
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
			gifs: [],
			pyramidIsZoomedIn: false,
			pyramidIsZoomedOut: true,
			pyramidIsZoomingIn: false,
			pyramidIsZoomingOut: false
		}

		this.defaultSearch = "trippy";
		this.handleKeyDown = this.handleKeyDown.bind(this);
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

	componentWillUnmount() {
		window.removeEventListener("keydown", this.handleKeyDown, false);
	}

	componentWillMount(){
		window.addEventListener("keydown", this.handleKeyDown, false);
	}

	handleSearch(event) {
		this.search(event.target.value);
	}

	handleSearchClick(event) {
		event.stopPropagation();
	}

	handleKeyDown(event) {
		if(this.props.zoomedIn && this.state.pyramidIsZoomedOut) {
			if(event.which === 27) { // esc
				this.props.zoomOut(event);
			}

			if(event.which >= 49 && event.which <= 58) { // 1
				this.refs.gifPyramid.zoomIn(event, event.which - 49);
			}
		}
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

	render() {
		const pyramidStyle = {
			height: "100%",
			top: 0
		};

		let inputContainerStyle = {
			transform: "translateY(" + (this.props.zoomedIn && !(this.state.pyramidIsZoomingIn || this.state.pyramidIsZoomedIn) ? "0" : "120px") + ")"
		}

		let elements = this.state.gifs.map( (gif, index) => {
			return (				
				<GifViewer key={gif.id} gif={gif}/>
			);
		});

		let gifPyramid;
		if(this.props.zoomedIn){
			let props = {
				erd: this.erd,
				onDidZoomIn: handlePyramidDidZoomIn.bind(this),
				onDidZoomOut: handlePyramidDidZoomOut.bind(this),
				onWillZoomIn: handlePyramidWillZoomIn.bind(this),
				onWillZoomOut: handlePyramidWillZoomOut.bind(this),
				style: pyramidStyle,
				derenderIfNotInViewAnymore: true,
				extraPaddingTop: 100,
				extraPaddingBottom: 100
			}

			gifPyramid = (
				<Pyramid ref="gifPyramid" {...props}>
					{elements}
				</Pyramid>
			);
		} else {
			gifPyramid = null;
		}

		return (
			<div className="demo">
				<Cover {...this.props} {...this.state}>Giphy</Cover>

				<div className="input-container" style={inputContainerStyle}>
					<input ref="input" type="search" placeholder="Search Giphy…" onChange={this.handleSearch} onClick={this.handleSearchClick} />
				</div>

				{gifPyramid}
			</div>
		);
	}
}