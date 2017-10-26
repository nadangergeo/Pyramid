import React from "react";
import PropTypes from 'prop-types';

function Shadow(WrappedComponent) {
	return class extends React.Component {
		static propTypes = {
			zoomable: PropTypes.bool
		};

		static defaultProps = { 
			zoomable: true
		};

		render() {
			const containerStyle = {
				position: "relative",
				width: "100%",
				height: "100%",
				boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
				transition: "box-shadow 200ms linear"
			};

			let smallShadowStyle = {
				position: "absolute",
				zIndex: -1,
				width: "100%",
				height: "auto",
				opacity: this.props.zoomingIn || this.props.zoomedIn ? 1 : 0,
				borderRadius: "5px",
				boxShadow: "0 10px 30px rgba(0,0,0,0.333)",
				transition: "opacity 200ms linear",
			};

			return (
				<div style={containerStyle}>
					<WrappedComponent {...this.props}/>
					<div style={smallShadowStyle}></div>
				</div>
			);
		}
	}
}

export default Shadow;