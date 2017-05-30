import React from "react";

import "./cover.css";
import CloseButton from "./closeButton";

export default class Cover extends React.Component {
	static propTypes = {
		themeColor: React.PropTypes.string,
		zIndex: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
	};

	static defaultProps = { 
		themeColor: "black",
		zIndex: "100"
	};

	render() {
		const coverStyle = {
			backgroundColor: this.props.themeColor,
			height: this.props.zoomedIn || this.props.zoomingIn ? "100px" : "100%",
			cursor: this.props.zoomedOut ? "pointer" : "auto",
			zIndex: this.props.zIndex
		};

		const headerStyle = {
			fontSize: this.props.zoomedIn || this.props.zoomingIn ? "2em" : null,
		}

		const cover = (
			<div className="cover" style={coverStyle} onClick={this.props.zoomIn}>
				<CloseButton {...this.props}/>
				<h1 className="cover__header" style={headerStyle}>{this.props.children}</h1>
			</div>
		);

		return cover;
	}
}