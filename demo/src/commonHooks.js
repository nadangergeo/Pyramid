function handlePyramidDidZoomIn(index, event) {
	this.setState({
		pyramidIsZoomedIn: true,
		pyramidIsZoomedOut: false,
		pyramidIsZoomingIn: false,
		pyramidIsZoomingOut: false
	});
}

function handlePyramidDidZoomOut(index, event) {
	this.setState({
		pyramidIsZoomedIn: false,
		pyramidIsZoomedOut: true,
		pyramidIsZoomingIn: false,
		pyramidIsZoomingOut: false,
		zoomIndex: null
	});
}

function handlePyramidWillZoomIn(index, event) {
	this.setState({
		pyramidIsZoomedIn: false,
		pyramidIsZoomedOut: false,
		pyramidIsZoomingIn: true,
		pyramidIsZoomingOut: false,
		zoomIndex: index
	});
}

function handlePyramidWillZoomOut(index, event) {
	this.setState({
		pyramidIsZoomedIn: false,
		pyramidIsZoomedOut: false,
		pyramidIsZoomingIn: false,
		pyramidIsZoomingOut: true
	});
}

export default {
	handlePyramidDidZoomIn,
	handlePyramidDidZoomOut,
	handlePyramidWillZoomIn,
	handlePyramidWillZoomOut
};