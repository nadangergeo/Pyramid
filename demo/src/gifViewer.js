import React from "react";
import PropTypes from 'prop-types';
import ImageViewer from "./ImageViewer";

export default class GifViewer extends React.Component {
	static propTypes = {
		zoomable: PropTypes.bool,
		inView: PropTypes.bool,
		gif: PropTypes.object.isRequired
	};

	static defaultProps = { 
		zoomable: true,
		inView: true
	};

	constructor(props) {
		super(props);

		this.state = {
			viewGif: false
		};
	}

	handleMouseOver() {
		this.setState({
			viewGif: true
		});
	}

	handleMouseOut() {
		this.setState({
			viewGif: false
		});
	}

	componentWillReceiveProps(nextProps) {
		if(nextProps.zoomingOut) {
			this.setState({
				viewGif: false
			});
		}
	}

	render() {
		const src = !this.props.zoomedOut || this.state.viewGif ? this.props.gif.src : this.props.gif.stillSrc;
		const width = (typeof this.props.gif.width) === "undefined" ? "auto" : this.props.gif.width;
		const height = (typeof this.props.gif.height) === "undefined" ? "auto" : this.props.gif.height;

		return (
			<div style={{height: "100%"}}onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)}>
				<ImageViewer {...this.props} src={src} width={width} height={height}/>
			</div>
		);
	}
}