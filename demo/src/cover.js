import React from "react";
import PropTypes from 'prop-types';

import "./cover.css";
import CloseButton from "./closeButton";

export default class Cover extends React.Component {
	static propTypes = {
		themeColor: PropTypes.string,
		zIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
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
			zIndex: this.props.zIndex,
			opacity: this.props.fullscreen ? 0 : 1
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