import React from "react";
import PropTypes from 'prop-types';

class Edge extends React.Component {
	static propTypes = {
	};

	static defaultProps = { 
	};

	render() {
		let containerWidth = this.props.containerWidth;

		const style = {
			
		};

		return (
			<div style={style} onClick={this.props.zoomedOut ? this.props.zoomIn : this.props.zoomOut}>
				{<WrappedComponent {...this.props}/>}
			</div>
		);
	}
}

export default Edge 