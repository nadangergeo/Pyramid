import React from "react";
import PropTypes from 'prop-types';

import pyramidGif from "../../img/pyramid.gif";

export default class Intro extends React.Component {
	render() {

		const containerStyle = {
			position: "relative",
			width: this.props.pyramidWidth,
			height: this.props.pyramidHeight,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			backgroundImage: "url(" + pyramidGif + ")",
			backgroundSize: "cover",
			backgroundPosition: "center center"
		};

		const titleStyle = {
			width: "100%",
			color: "white",
			textTransform: "uppercase",
			letterSpacing: "0.5em",
			margin: "0",
			lineHeight: 1,
			textAlign: "center"
		};

		let bgStyle = {
			position: "absolute",
			width: "100%",
			height: "100%",
			top: 0,
			left: 0,
			zIndex: 1,
		};

		return (
			<div style={containerStyle}>
				<h1 style={titleStyle}>Pyramid</h1>
			</div>
		);
	}
}