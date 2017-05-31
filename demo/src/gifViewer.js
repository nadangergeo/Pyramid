import React from "react";
import ImageViewer from "./imageViewer";

export default class GifViewer extends React.Component {
	static propTypes = {
		zoomable: React.PropTypes.bool,
		inView: React.PropTypes.bool,
		gif: React.PropTypes.object.isRequired
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

		return (
			<ImageViewer onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)} {...this.props}>
				<img src={src} width={this.props.gif.width} height={this.props.gif.height}/>
			</ImageViewer>
		);
	}
}