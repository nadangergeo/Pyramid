import React from "react";
import ReactDOM from "react-dom";
import PropTypes from 'prop-types';
import BEMHelper from "react-bem-helper";
import elementResizeDetector from "element-resize-detector";
import transitionUtility from "transition-utility";

class PyramidElement extends React.PureComponent {
	static propTypes = { 
		width: PropTypes.oneOfType([
					PropTypes.string,
					PropTypes.number
				]).isRequired,
		height: PropTypes.oneOfType([
					PropTypes.string,
					PropTypes.number
				]).isRequired,
		top: PropTypes.number,
		left: PropTypes.number,
		className: PropTypes.string,
		zoomTransition: PropTypes.string,
		inView: PropTypes.bool,
		erd: PropTypes.object,
		onWillZoomIn: PropTypes.func,
		onWillZoomOut: PropTypes.func,
		onDidZoomIn: PropTypes.func,
		onDidZoomOut: PropTypes.func,
	};

	static defaultProps = { 
		width: 0,
		height: 0,
		top: 0,
		left: 0,
		className: "element",
		inView: true,
	};

	constructor(props) {
		super(props);

		// Create a elementResizeDetector.
		this.erd = props.erd || elementResizeDetector({strategy: "scroll"});

		this.classes = new BEMHelper(props.className);

		this.state = {
			loaded: this.isMediaType() ? false : true,
			zoomedIn: false,
			zoomedOut: true,
			zoomingIn: false,
			zoomingOut: false,
			zoomTransition: null
		};

		this.styleNormalizer = {
			margin: 0,
			padding: 0,
			border: 0,
		};

		this.handleTransitionEnd = this.handleTransitionEnd.bind(this);
	}

	/**
	 * React life cycle method. Called when the component did mount.
	 */
	componentDidMount() {
		let element = this.getElementDOMNode();

		// Trigger rerenderings on resize events, using elementResizeDetector by mister Wnr ^^
		if(!this.isMediaType()) {
			this.erd.listenTo((this.props.height === "auto"), element, this.handleResize.bind(this));
		}

		// Handle css transition end events
		this.refs.elementContainer.addEventListener(transitionUtility.getEndEvent(), this.handleTransitionEnd, false);
	}

	/**
	 * React life cycle method. Called when the component is about to unmount.
	 */
	componentWillUnmount() {
		let element = this.getElementDOMNode();

		// Remove all event listeners
		if(element) {
			this.erd.removeAllListeners(element);
		}
		this.refs.elementContainer.removeEventListener(transitionUtility.getEndEvent(), this.transitionEndEventFunction, false);
	}

	/**
	 * React life cycle method. Called when the component did update.
	 * @param {object} prevProps The previous property.
	 * @param {object} prevState The previous State.
	 */
	componentDidUpdate(prevProps, prevState) {
		if(this.state.zoomingIn || this.state.zoomingOut) {
			if(!this.hasZoomTransition()) {
				// console.log("no transiton, faking transition end event");
				this.handleTransitionEnd();
			}
		}
	}

	/**
	 * Returns the DOM node that corresponds to the element.
	 */
	getElementDOMNode() {
		let element = this.refs[this.element.ref];

		if(this.isReactElement()) {
			element = ReactDOM.findDOMNode(element);
		}

		return element;
	}

	/**
	 * Handles resize events from Element Resize Detector
	 * @param {object} element The DOM element
	 */
	handleResize(element) {
		let width = element.clientWidth;
		let height = element.clientHeight;

		if(this.state.zoomedOut) {
			this.props.onResize(this.props.index, width, height);
		}
	}

	/**
	 * Handles resize events from Element Resize Detector
	 * @param {object} element The DOM element
	 */
	handleTransitionEnd(event) {
		if (typeof event === "undefined" || event.propertyName === "width") {
			if(this.state.zoomingIn) {
				this.didZoomIn(event);
			} else if(this.state.zoomingOut) {
				this.didZoomOut(event);
			}
		}
	}

	/**
	 * Returns true if the element container has a zoom transition set.
	 */
	hasZoomTransition() {
		let style = this.refs.elementContainer.style;
		let computedStyle = window.getComputedStyle(this.refs.elementContainer);

		return parseFloat(style.transitionDuration) > 0 || parseFloat(computedStyle.transitionDuration) > 0;
	}

	/**
	 * Returns the zoom transition
	 */
	getZoomTransition() {
		if(!this.refs.elementContainer) {
			return null
		};

		let style = this.refs.elementContainer.style;
		let computedStyle = window.getComputedStyle(this.refs.elementContainer);
		let transition = style.transition || computedStyle.transition;

		return this.state.zoomTransition || this.props.zoomTransition || transition || null;
	}

	/**
	 * Handles when a a media has been loaded (if the element is a media element)
	 */
	handleImageLoaded() {
		this.setState(
			{ loaded : true }
		);
	}

	/**
	 * Returns true if the element is a media type.
	 */
	isMediaType() {
		return ["img", "video", "audio", "object", "iframe"].indexOf(this.props.children.type) !== -1;
	}

	/**
	 * Returns true if the element is a media type.
	 */
	isReactElement() {
		return (typeof this.props.children.type === "function");
	}

	/**
	 * Zoom in the element
	 * @param {string} zoomTransition Optional transition that you can use to override the global zoomTransition prop/css.
	 */
	zoomIn(event, zoomTransition) {
		event && event.stopPropagation();

		if(this.state.zoomedIn) {
			// already zoomed in
			return;
		}

		let element = this.props.children;

		if(typeof element.props.onWillZoomIn === "function") {
			element.props.onWillZoomIn();
		}

		if(typeof this.props.onWillZoomIn === "function") {
			this.props.onWillZoomIn(this.props.index);
		}

		this.setState({
			zoomedIn: false,
			zoomedOut: false,
			zoomingIn: true,
			zoomingOut: false,
			zoomTransition: zoomTransition
		});
	}

	/**
	 * Zoom out the element
	 * @param {string} zoomTransition Optional transition that you can use to override the global zoomTransition prop/css.
	 */
	zoomOut(event, zoomTransition) {
		event && event.stopPropagation();

		if(this.state.zoomedOut) {
			// already zoomed out
			return;
		}

		let element = this.props.children;

		if(typeof element.props.onWillZoomOut === "function") {
			element.props.onWillZoomOut();
		}

		if(typeof this.props.onWillZoomOut === "function") {
			this.props.onWillZoomOut(this.props.index);
		}

		this.setState({
			zoomedIn: false,
			zoomedOut: false,
			zoomingIn: false,
			zoomingOut: true,
			zoomTransition: zoomTransition
		});
	}

	/**
	 * Called when the zoom in transition has ended
	 * @param {object} from The transition end event.
	 */
	didZoomIn(event) {
		let element = this.props.children;

		if(typeof element.props.onDidZoomIn === "function") {
			element.props.onDidZoomIn();
		}

		if(typeof this.props.onDidZoomIn === "function") {
			this.props.onDidZoomIn(this.props.index);
		}

		this.setState({
			zoomedIn: true,
			zoomedOut: false,
			zoomingIn: false,
			zoomingOut: false,
			zoomTransition: null
		});
	}

	/**
	 * Called when the zoom out transition has ended
	 * @param {object} from The transition end event.
	 */
	didZoomOut(event) {
		let element = this.props.children;

		if(typeof element.props.onDidZoomOut === "function") {
			element.props.onDidZoomOut();
		}

		if(typeof this.props.onDidZoomOut === "function") {
			this.props.onDidZoomOut(this.props.index);
		}

		this.setState({
			zoomedIn: false,
			zoomedOut: true,
			zoomingIn: false,
			zoomingOut: false,
			zoomTransition: null
		});

		if(!this.isMediaType()) {
			this.props.onResize(this.props.index, this.props.width, this.props.height);
		}
	}

	render() {
		let element = this.props.children;

		// Element container
		// ------------------------------------------------------------------------

		let containerStyle = Object.assign({}, this.styleNormalizer);
		containerStyle = Object.assign(containerStyle, {
			display: "block",
			width: isNaN(this.props.width) ? this.props.width : this.props.width + "px",
			height: isNaN(this.props.height) ? this.props.height : this.props.height + "px",
			position: "absolute",
			top: this.props.top,
			left: this.props.left,
			zIndex: !this.state.zoomedOut ? 9999 : 0,
			opacity: this.props.inView && this.state.loaded && this.props.height !== "auto" ? 1 : 0,
			willChange: "top, left, width, height",
			transform: "translateZ(0)"
		});

		if(this.state.zoomedIn || this.state.zoomingIn) {
			containerStyle = Object.assign(containerStyle, {
				top: this.props.pyramidScrollTop,
				left: 0,
				width: "100%",
				height: "100%",
				overflowY: "auto",
				MsOverflowStyle: "-ms-autohiding-scrollbar",
				WebkitOverflowScrolling: "touch"
			});
		}

		if(this.state.zoomingIn || this.state.zoomingOut || this.state.zoomedIn) {
			containerStyle = Object.assign(containerStyle, {
				transition: this.getZoomTransition()
			});
		}

		let containerClassesOptions = {
			modifiers: element.props.zoomable ? {
				"zoomable": true,
				"zoomedIn": this.state.zoomedIn,
				"zoomedOut": this.state.zoomedOut,
				"zoomingIn": this.state.zoomingIn,
				"zoomingOut": this.state.zoomingOut
			} : null
		};

		let containerProps = {
			style: containerStyle,
			className: this.classes(containerClassesOptions).className
		}

		// Element
		// ------------------------------------------------------------------------

		let elementStyle = Object.assign({}, this.styleNormalizer);
		elementStyle = Object.assign(elementStyle, {
			width: "100%",
			height: "auto",
			boxSizing: "border-box",
			WebkitTransform: "translateZ(0)", //GPU-acceleration, does it help?
			transform: "translateZ(0)"
		});

		if(element.props.style) {
			elementStyle = Object.assign(elementStyle, element.props.style);
		}

		let elementProps = {
			style: elementStyle,
			onLoad: this.isMediaType() ? this.handleImageLoaded.bind(this) : null,
			width: this.isMediaType() ? null : element.props.width,
			height: this.isMediaType() ? null : element.props.height,
			ref: element.ref ? element.ref : "element"
		}

		if(this.isReactElement()) {            
			elementProps.erd = this.erd;
			elementProps.inView = this.props.inView;
			elementProps.containerWidth = this.props.width;
			elementProps.containerHeight = this.props.height;
			elementProps.pyramidWidth = this.props.pyramidWidth;
			elementProps.pyramidHeight = this.props.pyramidHeight;

			if(this.state.zoomedIn || this.state.zoomingIn) {
				elementProps.containerWidth = this.props.pyramidWidth;
				elementProps.containerHeight = this.props.pyramidHeight;
			}

			if(element.props.zoomable) {
				elementProps.zoomIn = this.zoomIn.bind(this);
				elementProps.zoomOut = this.zoomOut.bind(this);
				elementProps.zoomedIn = this.state.zoomedIn;
				elementProps.zoomedOut = this.state.zoomedOut;
				elementProps.zoomingIn = this.state.zoomingIn;
				elementProps.zoomingOut = this.state.zoomingOut;
				elementProps.zoomTransition = this.getZoomTransition();
			}
		}

		this.element = React.cloneElement(element, elementProps);

		return(
			<div ref="elementContainer" {...containerProps}>
				{this.props.inView || !this.isMediaType() ? this.element : ""}
			</div>
		);
	}
}

export default PyramidElement;