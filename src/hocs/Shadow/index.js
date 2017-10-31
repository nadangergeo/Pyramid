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
				boxShadow: "0 4px 8px rgba(0,0,0,0.333)",
				transition: this.props.zoomTransition,
				transitionProperty: "all"
			};

			let smallShadowStyle = {
				position: "absolute",
				top: 0,
				left: 0,
				zIndex: 0,
				width: this.props.containerWidth,
				height: this.props.containerHeight,
				opacity: this.props.zoomingIn || this.props.zoomedIn ? 1 : 0,
				boxShadow: "0 100px 300px rgba(0,0,0,1)",
				transition: this.props.zoomTransition,
				transitionProperty: "all"
			};

			return (
				<div style={containerStyle}>
					<div style={smallShadowStyle}></div>
					<WrappedComponent {...this.props}/>
				</div>
			);
		}
	}
}

export default Shadow;