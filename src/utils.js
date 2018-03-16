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

function getTransitionTimingsFromComputedStyle(computedStyle) {
	let tmp1 = computedStyle.transitionTimingFunction.split(",");
	let tmp2 = [];
	let timings = [];
	let cb = false;

	for(let i = 0; i < tmp1.length; i++) {
		let a = tmp1[i];
		
		if(cb) {
			tmp2.push(a);
			
			if(a.includes(")")) {
				timings.push(tmp2.toString());
				tmp2 = [];
				cb = false;
			}
		}else if(a.includes("cubic-bezier")) {
			cb = true;
			tmp2.push(a);
			continue;
		} else {
			timings.push(a.trim());
		}
	}

	return timings;
};

function getShorthandTransitionFromComputedStyle(computedStyle) {
	const transitionProperties = computedStyle.transitionProperty.split(", ");
	const transitionDurations = computedStyle.transitionDuration.split(", ");
	const transitionTimingFunctions = getTransitionTimingsFromComputedStyle(computedStyle);
	const transitionDelays = computedStyle.transitionDelay.split(", ");

	return transitionProperties.map((property, index) => {
		console.log(property);
		return property + " " + transitionDurations[index] + " " + transitionTimingFunctions[index] + " " + transitionDelays[index];
	}).join(", ");
};

export {
	handlePyramidDidZoomIn,
	handlePyramidDidZoomOut,
	handlePyramidWillZoomIn,
	handlePyramidWillZoomOut,
	getShorthandTransitionFromComputedStyle
};