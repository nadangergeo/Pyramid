import React from "react";

export default class CloseButton extends React.Component {
	render() {
		const closeButtonStyle = {
		    display: "block",
		    padding: "10px",
		    position: "fixed",
		    zIndex: 1000,
		    top: "20px",
		    left: "20px",
		    fill: "white",
		    backgroundColor: "black",
		    opacity: this.props.zoomedIn ? 1 : 0,
		    transition: "opacity 200ms linear",
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