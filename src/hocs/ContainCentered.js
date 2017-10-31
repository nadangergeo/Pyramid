import React from "react";
import PropTypes from 'prop-types';

function ContainCentered(WrappedComponent) {
	return class extends React.PureComponent {
		static propTypes = {
			width: PropTypes.oneOfType([
						PropTypes.string,
						PropTypes.number
					]).isRequired,
			height: PropTypes.oneOfType([
						PropTypes.string,
						PropTypes.number
					]).isRequired
		};

		render() {
			let containerWidth = this.props.containerWidth;
			let containerHeight = this.props.containerHeight;

			const style = {
				width: "100%",
				height: "100%",
				// backgroundColor: this.props.zoomedIn || this.props.zoomingIn || this.props.zoomingOut ? (this.props.backgroundColor || "black") : "transparent",
				// backgroundColor: this.props.zoomedIn ? (this.props.backgroundColor || "black") : "transparent",
				// backgroundColor: "black",
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				overflow: "hidden", //fulfix-ish
				// transition: "background-color 300ms linear"
			};

			// const cmin = Math.min(containerWidth, containerHeight);
			const aspectRatio = this.props.height / this.props.width;

			// const height = cmin * aspectRatio;
			// const width = this.props.zoomedOut ? this.props.containerWidth : (height < containerHeight ? (containerHeight / aspectRatio) : cmin) + "px";
			const width = this.props.zoomedOut ? this.props.containerWidth : (containerHeight / aspectRatio) + "px";

			const wrappedComponentProps = {
				...this.props,
				containerWidth: width,
				containerHeight: containerHeight
			};

			return (
				<div style={style}>
					<WrappedComponent {...wrappedComponentProps}/>
				</div>
			);
		}
	}
}

export default ContainCentered;