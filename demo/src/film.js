import React from "react";
import ReactDOM from "react-dom";

import "./film.css";
import CloseButton from "./closeButton";

class Film extends React.PureComponent {
	static propTypes = {
		zoomable: React.PropTypes.bool,
		inView: React.PropTypes.bool,
		data: React.PropTypes.object.isRequired
	};

	static defaultProps = { 
		zoomable: true,
		inView: true
	};

	constructor(props) {
		super(props);

		this.state = {
			loaded: false
		}
	}

	handleResize(event) {
		let element = event;
		let width = element.clientWidth;
		let height = element.clientHeight;

		if((!this.state.zoomingIn && !this.state.zoomingOut && !this.state.zoomedIn)) {
			this.props.onResize(this.props.index, width, height);
		}
	}

	handlePosterLoaded() {
		this.setState(
			{ loaded : true }
		);
	}

	render() {

		const data = this.props.data;
		const posterData = data.poster;

		// Film
		// ------------------------------------------------------------------------

		const filmStyle = {
			backgroundColor: this.props.zoomedIn || this.props.zoomingIn || this.props.zoomingOut ? "black" : "rgba(0,0,0,0.1)",
			cursor: this.props.zoomedOut ? "pointer" : "auto",
			width: this.props.zoomedOut ? this.props.containerWidth : "100%",
			height: this.props.zoomedOut ? this.props.containerWidth / posterData.width * posterData.height : "auto"
		};

		// Poster
		// ------------------------------------------------------------------------

		const posterContainerStyle = {
			width: this.props.zoomedIn || this.props.zoomingIn ? "50%" : this.props.containerWidth,
		}

		const posterStyle = {
			opacity: this.props.inView && this.state.loaded ? 1 : 0,
			transform: this.props.zoomedIn || this.props.zoomingIn ? "scale(0.8)" : "none",
		};

		const posterProps = {
			src: posterData.src,
			className: "film__poster",
			style: posterStyle,
			onLoad: this.handlePosterLoaded.bind(this),
			width: null,
			height: null
		}

		const poster = React.createElement("img", posterProps);

		// Info
		// ------------------------------------------------------------------------

		const infoStyle = {
			opacity: this.props.zoomedIn ? 1 : 0
		};

		const genres = data.genres.map( (genre, index) => {
			return (<li className="film__genre" key={index}>{genre}</li>)
		});

		return(
			<div className="film" style={filmStyle} onClick={this.props.zoomIn}>
				<CloseButton {...this.props} position="absolute"/>

					<div className="film__posterContainer" style={posterContainerStyle}>
						{this.props.inView ? poster: ""}
					</div>

					<div className="film__info" style={infoStyle}>
						<h1 className="film__title">
							{data.title} <span className="film__year">({data.year})</span>
						</h1>

						<ul className="film__genres">
							{genres}
						</ul>

						<p className="film__summary">{data.summary}</p>

						<h2>Director:</h2>
						<p className="film__creds">{data.director.join(", ")}</p>

						<h2>Stars:</h2>
						<p className="film__creds">{data.stars.join(", ")}</p>

						<h2>Screenplay:</h2>
						<p className="film__creds">{data.screenplay.join(", ")}</p>

						<button style={{backgroundColor: this.props.themeColor}}>Play trailer</button>
						<button style={{backgroundColor: this.props.themeColor}}>Play movie</button>
					</div>
			</div>
		);
	}
}

export default Film;