import React from "react";
import PropTypes from 'prop-types';
import CloseButton from "../../src/components/closeButton";

function Zoomable(WrappedComponent) {
	return class extends React.PureComponent {
		static propTypes = {
			zoomable: PropTypes.bool
		};

		static defaultProps = { 
			zoomable: true
		};

		handleKeyDown(event) {
			if(this.props.zoomedIn) {
				if(event.which === 27) { // esc
					this.props.zoomOut(event);
				}
			}
		}

		componentWillUnmount() {
			window.removeEventListener("keydown", this.handleKeyDown.bind(this), false);
		}

		componentWillMount(){
			window.addEventListener("keydown", this.handleKeyDown.bind(this), false);
		}

		render() {
			return (
				<div style={{cursor:"pointer", height: this.props.zoomedOut ? "auto" : "100%"}} onClick={this.props.zoomedOut ? this.props.zoomIn : null}>
					<CloseButton {...this.props} position="fixed"/>
					<WrappedComponent {...this.props}/>
				</div>
			);
		}
	}
}

export default Zoomable;