function handlePyramidDidZoomIn(event) {
	this.setState({
		pyramidIsZoomedIn: true,
		pyramidIsZoomedOut: false,
		pyramidIsZoomingIn: false,
		pyramidIsZoomingOut: false
	});
}

function handlePyramidDidZoomOut(event) {
	this.setState({
		pyramidIsZoomedIn: false,
		pyramidIsZoomedOut: true,
		pyramidIsZoomingIn: false,
		pyramidIsZoomingOut: false
	});
}

function handlePyramidWillZoomIn(event) {
	this.setState({
		pyramidIsZoomedIn: false,
		pyramidIsZoomedOut: false,
		pyramidIsZoomingIn: true,
		pyramidIsZoomingOut: false
	});
}

function handlePyramidWillZoomOut(event) {
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