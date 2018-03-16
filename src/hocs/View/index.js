import React from "react";
import PropTypes from 'prop-types';
import elementResizeDetector from "element-resize-detector";

import Cover from "../../components/Cover";
import {
	handlePyramidDidZoomIn,
	handlePyramidDidZoomOut,
	handlePyramidWillZoomIn,
	handlePyramidWillZoomOut
} from "../../utils";

function View(WrappedComponent) {
	return class extends React.Component {
		static propTypes = {
			zoomable: PropTypes.bool,
			viewClassName: PropTypes.string,
			coverHeight: PropTypes.string
		};

		static defaultProps = { 
			zoomable: true,
			viewClassName: "view",
			coverHeight: "100px"
		};

		constructor(props) {
			super(props);

			// Create a elementResizeDetector.
			this.erd = props.erd || elementResizeDetector({strategy: "scroll"});

			this.state = {
				pyramidIsZoomedIn: false,
				pyramidIsZoomedOut: true,
				pyramidIsZoomingIn: false,
				pyramidIsZoomingOut: false
			};
		}

		componentWillUnmount() {
			window.removeEventListener("keydown", this.handleKeyDown.bind(this), false);
		}

		componentWillMount(){
			window.addEventListener("keydown", this.handleKeyDown.bind(this), false);
		}

		handleKeyDown(event) {
			if(this.props.zoomedIn && this.state.pyramidIsZoomedOut) {
				if(event.which === 27) { // esc
					this.props.zoomOut(event);
				}
			}
		}

		render() {
			// const coverHeight = this.props.zoomedIn || this.props.zoomingIn ? "100px" : "100px";
			const coverHeight = "100px";

			const viewStyle = {
				position: "relative",
				zIndex: "100",
				width: "100%",
				height: "100%",
				minHeight: coverHeight
			};

			const pyramidStyle = {
				height: "100%"
			};

			let pyramid;
			if(this.props.zoomedIn){
				let pyramidProps = {
					...this.props,
					erd: this.erd,
					onDidZoomIn: handlePyramidDidZoomIn.bind(this),
					onDidZoomOut: handlePyramidDidZoomOut.bind(this),
					onWillZoomIn: handlePyramidWillZoomIn.bind(this),
					onWillZoomOut: handlePyramidWillZoomOut.bind(this),
					style: pyramidStyle,
					extraPaddingTop: 100,
					ref: "pyramid"
				}

				pyramid = (
					<WrappedComponent {...pyramidProps}>
						{this.props.children}
					</WrappedComponent>
				);
			} else {
				pyramid = null;
			}

			return (
				<div style={viewStyle} className={this.props.viewClassName}>
					<Cover {...this.props} {...this.state} coverHeight={coverHeight}>{this.props.title}</Cover>

					{pyramid}
				</div>
			);
		}
	}
}

export default View;