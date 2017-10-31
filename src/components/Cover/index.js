import React from "react";
import PropTypes from 'prop-types';

import CloseButton from "../CloseButton";

export default class Cover extends React.Component {
	static propTypes = {
		themeColor: PropTypes.string,
		zIndex: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
	};

	static defaultProps = { 
		themeColor: "black",
		zIndex: "20000"
	};

	render() {
		const coverStyle = {
			backgroundColor: this.props.themeColor || "#000",
			height: this.props.zoomedIn || this.props.zoomingIn ? "100px" : "100px",
			cursor: this.props.zoomedOut ? "pointer" : "auto",
			zIndex: this.props.zIndex,
			transform: "translateY(" + (this.props.pyramidIsZoomingIn || this.props.pyramidIsZoomedIn ? "-100px" : 0) + ")",
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			position: "absolute",
			top: "0",
			left: "0",
			bottom: "0",
			right: "0",
			zIndex: "10000",
			overflow: "visible",
			color: "#fff",
			opacity: "1",
			transition: this.props.zoomTransition,
			boxShadow: "0 1px 10px rgba(0, 0, 0, 0.3)"
		};

		const headerStyle = {
			// fontSize: this.props.zoomedIn || this.props.zoomingIn ? "2em" : null,
			display: "block",
			textAlign: "center",
			fontSize: "1.5em",
			fontWeight: 600,
			transition: "all 200ms linear",
			marginBottom: "0",
			marginTop: "0"
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