import React from "react";
import "./cover.css";

export default class Cover extends React.Component {
	render() {
		const coverStyle = {
		    height: this.props.zoomedIn || this.props.zoomingIn ? "100px" : "100%",
		    cursor: this.props.zoomedOut ? "pointer" : "auto" 
		};

		const headerStyle = {
		    fontSize: this.props.zoomedIn || this.props.zoomingIn ? "2em" : null,
		}

		const cover = (
			<div className="cover" style={coverStyle} onClick={this.props.zoomIn}>
			    <h1 className="cover__header" style={headerStyle}>{this.props.children}</h1>
			</div>
		);

		return cover;
	}
}