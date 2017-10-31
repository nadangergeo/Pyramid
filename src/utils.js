function handlePyramidDidZoomIn(index, event) {
	this.setState({
		pyramidIsZoomedIn: true,
		pyramidIsZoomedOut: false,
		pyramidIsZoomingIn: false,
		pyramidIsZoomingOut: false
	});

	this.props.onDidZoomIn && this.props.onDidZoomIn();
}

function handlePyramidDidZoomOut(index, event) {
	this.setState({
		pyramidIsZoomedIn: false,
		pyramidIsZoomedOut: true,
		pyramidIsZoomingIn: false,
		pyramidIsZoomingOut: false,
		zoomIndex: null
	});

	this.props.onDidZoomOut && this.props.onDidZoomOut();
}

function handlePyramidWillZoomIn(index, event) {
	this.setState({
		pyramidIsZoomedIn: false,
		pyramidIsZoomedOut: false,
		pyramidIsZoomingIn: true,
		pyramidIsZoomingOut: false,
		zoomIndex: index
	});

	this.props.onWillZoomIn && this.props.onWillZoomIn();
}

function handlePyramidWillZoomOut(index, event) {
	this.setState({
		pyramidIsZoomedIn: false,
		pyramidIsZoomedOut: false,
		pyramidIsZoomingIn: false,
		pyramidIsZoomingOut: true
	});

	this.props.onWillZoomOut && this.props.onWillZoomOut();
}

export {
	handlePyramidDidZoomIn,
	handlePyramidDidZoomOut,
	handlePyramidWillZoomIn,
	handlePyramidWillZoomOut
};