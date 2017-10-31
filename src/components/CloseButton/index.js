import React from "react";
import PropTypes from 'prop-types';

export default class CloseButton extends React.Component {
	static propTypes = {
		themeColor: PropTypes.string,
		position: PropTypes.string
	};

	static defaultProps = { 
		themeColor: "black",
		position: "absolute"
	};

	render() {
		const closeButtonStyle = {
			display: "block",
			boxSizing: "border-box",
			height: "60px",
			padding: "10px",
			position: this.props.position,
			zIndex: 1000,
			top: "20px",
			right: "20px",
			fill: "white",
			backgroundColor: this.props.themeColor,
			opacity: this.props.zoomTransition === "none" || this.props.zoomedIn ? 1 : 0,
			transition: this.props.zoomTransition,
			transitionProperty: "opacity",
			transitionTimingFunctin: "linear",
			cursor: "pointer"
		};

		const closeButton = !this.props.zoomedOut ? (
			<div style={closeButtonStyle} onClick={this.props.zoomOut}>
				<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
			</div>
		) : null;

		return closeButton;
	}
}