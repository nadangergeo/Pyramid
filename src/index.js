import React from "react";
import PropTypes from 'prop-types';
import BEMHelper from "react-bem-helper";
import getUnit from "get-unit";
import elementResizeDetector from "element-resize-detector";
import throttle from "lodash.throttle";

import PyramidElement from "./PyramidElement";

export default class Pyramid extends React.PureComponent {
	static propTypes = { 
		numberOfColumns: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
		magicValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
		className: PropTypes.string,
		gutter: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
		padding: PropTypes.oneOfType([PropTypes.number, PropTypes.string, PropTypes.object]),
		extraPaddingTop: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		extraPaddingBottom: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
		zoomTransition: PropTypes.string,
		derenderIfNotInViewAnymore: PropTypes.bool,
		style: PropTypes.object,
		scroller: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
		erd: PropTypes.object,
		onWillZoomIn: PropTypes.func,
		onWillZoomOut: PropTypes.func,
		onDidZoomIn: PropTypes.func,
		onDidZoomOut: PropTypes.func
	};

	static defaultProps = { 
		numberOfColumns: {
			default: 1,
			breakpoints: {
				"768px"  : 2,
				"1024px" : 3,
				"1280px" : 4,
				"1440px" : 5 
			}
		},
		magicValue: 0,
		className: "pyramid", //This will be the B in BEM
		gutter: 20,
		padding: 20,
		extraPaddingTop: 0,
		extraPaddingBottom: 0,
		derenderIfNotInViewAnymore: true,
		scroller: true
	};

	constructor(props) {
		super(props);

		// Create a elementResizeDetector.
		this.erd = props.erd || elementResizeDetector({strategy: "scroll"});

		// Create a BEMHelper.
		this.classes = new BEMHelper(props.className);

		// Initial styling
		this.style = {
			display: "block",
			position: "relative",
			width: "100%",
			height: "auto",
			clear: "both"
		}

		this.pyramidWidth = null;
		this.allElementProps = [];
		
		// Create initial state.
		this.state = {
			zoomedIn: false,
			zoomedOut: true,
			zoomingIn: false,
			zoomingOut: false,
			zoomIndex: null,
			measurements: {}
		}

		// You can call these on Pyramid to zoomIn/zoomOut an element
		// See function declartions for more insight.
		this.zoomIn = this.zoomIn.bind(this);
		this.zoomOut = this.zoomOut.bind(this);
	}

	/**
	 * React life cycle method. Called when the component did mount.
	 */
	componentDidMount() {
		this.mounted = true;

		// Trigger rerenderings on resize events, using elementResizeDetector by mister Wnr ^^
		this.erd.listenTo(false, this.refs.pyramid, this.handleResize.bind(this));

		// Trigger rerenderings on scroll events, throttled.
		this.scrollEventFunction = this.handleScroll.bind(this);
		this.throttledScrollEventFunction = throttle(this.scrollEventFunction, 50);
		this.getScroller().addEventListener('scroll', this.throttledScrollEventFunction, true);
	}

	/**
	 * React life cycle method. Called when the component is about to unmount.
	 */
	componentWillUnmount() {
		this.mounted = false;

		// Remove all event listeners
		this.erd.removeAllListeners(this.refs.pyramid);
		this.getScroller().removeEventListener('scroll', this.throttledScrollEventFunction, true);
	}

	/**
	 * Returns element which handles the scrolling
	 */
	getScroller() {
		if(this.scroller) { // Have we already figured out the scroller?
			return this.scroller;
		} else if(typeof this.props.scroller === "object") { // Is there a prop?
			return this.scroller = this.props.scroller;
		} else if(this.props.scroller === true) { // Is pyramid the scroller?
			return this.scroller = this.refs.pyramid;
		} else { // Let's try figuring out the scroller (TODO: replace this method)
			let scroller;
			let el = this.refs.pyramid;
			let found = false;

			while(!found) {
				el = el.parentNode;

				if(el === document.querySelector('body')) {
					found = true;
					scroller = window;
				} else if(el.clientHeight < el.scrollHeight) {
					found = true;
					scroller = el;
				}
			}

			return this.scroller = scroller;
		} 
	}

	/**
	 * Returns the top of the scroller
	 */
	getScrollTop(scroller = this.getScroller()){
		return scroller === window ? scroller.pageYOffset : scroller.scrollTop;
	}

	/**
	 * Handles resize events from Element Resize Detector
	 * @param {object} pyramidElement The pyramid DOM element
	 */
	handleResize(pyramidElement) {
		this.reRender();
	}

	/**
	 * Handles scroll events
	 * @param {object} event SyntheticEvent (scroll)
	 */
	handleScroll(event) {
		if(this.state.zoomedIn) {
			event.preventDefault();
			return;
		}

		this.reRender();
	}

	/**
	 * Returns true if the element (the parameters) are within the Pyramids view.
	 * @param {number} top The vertical position of the element.
	 * @param {number} height The height of the element
	 * @param {number} magicValue Magic Value to use. Should be a fraction between 0-1. If >0, then it will be less strict.
	 */
	isInView(top, height, magicValue) {
		// If the element is in view (or close to using magic value).
		// One could say this is mathemagic.

		let scroller = this.getScroller();
		let magic = (magicValue * this.refs.pyramid.offsetHeight);
		let scrollerHeight = scroller.offsetHeight || scroller.innerHeight;
		let offsetTop = this.props.scroller ? 0 : this.refs.pyramid.offsetTop;
		let scrollTop = this.getScrollTop();

		if(
			( top + magic >= scrollTop - offsetTop
			  &&
			  top < ( scrollTop + scrollerHeight - offsetTop) + magic
			)
			||
			( (top + height) + magic > scrollTop - offsetTop
			  &&
			  top + height < (scrollTop + scrollerHeight - offsetTop) + magic
			)
		) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Zoom in an element
	 * @param {object} event The event that caused the method call.
	 * @param {number} index The index of the element to zoom in.
	 * @param {string} zoomTransition Optional transition that you can use to override the global zoomTransition prop/css.
	 */
	zoomIn(event, index, zoomTransition = null) {
		// return new Promise((abracadabra, defectus) => {
		// 	this.promises.push({
		// 		spell: "zoomIn",
		// 		index,
		// 		abracadabra,
		// 		defectus
		// 	});

		// 	this.refs["element" + index].zoomIn(event, zoomTransition);
		// });

		this.refs["element" + index].zoomIn(event, zoomTransition);
	}

	/**
	 * Zoom out an element
	 * @param {object} event The event that caused the method call.
	 * @param {number} index The index of the element to zoom out.
	 * @param {string} zoomTransition Optional transition that you can use to override the global zoomTransition prop/css.
	 */
	zoomOut(event, index, zoomTransition) {
		this.refs["element" + index].zoomOut(event, zoomTransition);
	}

	/**
	 * Switch out which element is zoomed in, with no transitions.
	 * @param {number} from The index of the element to zoom out.
	 * @param {number} to The index of the element to zoom in.
	 */
	switchZoom(from, to) {
		this.setState({
			switching: true,
			zoomIndex: to
		});

		this.refs["element" + from].zoomOut(null, "none");
		this.refs["element" + to].zoomIn(null, "none");
	}

	/**
	 * Called by an element as it is about to zoom in.
	 * @param {number} from The index of the element which will zoom in.
	 */
	willZoomIn(index) {
			// console.log("willZoomIn!");

			// Do nothing if it's just a switch
			if(this.state.switching) {
				return;
			}

			// Call prop onWillZoomIn if set
			if(typeof this.props.onWillZoomIn === "function") {
				this.props.onWillZoomIn(index);
			}

			// Update Zoom states
			this.setState({
				zoomedIn: false,
				zoomedOut: false,
				zoomingIn: true,
				zoomingOut: false,
				zoomIndex: index
			});
	}

	/**
	 * Called by an element as it is about to zoom out.
	 * @param {number} from The index of the element which will zoom out.
	 */
	willZoomOut(index) {
			// console.log("willZoomOut!");

			// Do nothing if it's just a switch
			if(this.state.switching) {
				return;
			}

			// Call prop onWillZoomOut if set
			if(typeof this.props.onWillZoomOut === "function") {
				this.props.onWillZoomOut(index);
			}

			// Update Zoom states
			this.setState({
				zoomedIn: false,
				zoomedOut: false,
				zoomingIn: false,
				zoomingOut: true
			});
	}

	/**
	 * Called by an element when it has finished zooming in.
	 * @param {number} from The index of the element which has zoomed in.
	 */
	didZoomIn(index) {
			// console.log("didZoomIn!");

			// Do nothing if it's just a switch
			if(this.state.switching) {
				return;
			}

			// Call prop onDidZoomIn if set
			if(typeof this.props.onDidZoomIn === "function") {
				this.props.onDidZoomIn(index);
			}

			// Update Zoom states
			this.setState({
				zoomedIn: true,
				zoomedOut: false,
				zoomingIn: false,
				zoomingOut: false
			});

			// for(let i = 0; i < this.promises.length; i++) {
			// 	let promise = this.promises[i];

			// 	if(promise.spell === "zoomIn") {
			// 		promise.abracadabra(index);
			// 	}
			// }
	}

	/**
	 * Called by an element when it has finished zooming out.
	 * @param {number} from The index of the element which has zoomed out.
	 */
	didZoomOut(index) {
			// console.log("didZoomOut!");

			// If it's a switch, the switch is now done.
			// Update state and do nothing else.
			if(this.state.switching) {
				this.setState({
					switching: false
				});

				return;
			}

			// Call prop onDidZoomOut if set
			if(typeof this.props.onDidZoomOut === "function") {
				this.props.onDidZoomOut(index);
			}

			// Update Zoom states
			this.setState({
				zoomedIn: false,
				zoomedOut: true,
				zoomingIn: false,
				zoomingOut: false,
				zoomIndex: null
			});
	}

	/**
	 * Updates necesseary measurements for an element
	 * @param {number} index The index of the element to update.
	 * @param {number} width The new width.
	 * @param {number} height The new height.
	 */
	updateMeasurements(index, width, height) {
		let newMeasurements = Object.assign(this.state.measurements, {
			[index]: {
				width: width,
				height: height
			}
		});

		this.setState({
			measurements: newMeasurements
		})
	}

	/**
	 * Returns a value, which is resonsive (the prop has breakpoints).
	 * @param {string} prop The responsive property to get value from.
	 */
	getResponsivePropValue(prop) {
		let value;

		if(typeof this.props[prop] === "number") {
			value = this.props[prop];
		} else if(typeof this.props[prop] === "string") {
			value = parseInt(this.props[prop], 10);
		} else {
			// Let the value be intially defined as the default value.
			value = this.props[prop].default;
			// Then let us iterate through all the breakpoints.
			for(let key in this.props[prop].breakpoints) {
				if (this.props[prop].breakpoints.hasOwnProperty(key)) {
					// What unit was the breakpoint defined with?
					let unit = getUnit(key);

					// Pyramid only supports pixels atm.
					// Todo: support ems and % ?
					if(unit !== "px") {
						throw new Error("Pyramid does not support the unit '" + unit + "' for breakpoints in the property " + prop + ". You could always help out to implement it and make a pull request ^^ Cheers!");
					}

					// If the width of the Pyramid is greater or equal to the breakpoint, then...
					if(this.pyramidWidth >= parseInt(key, 10)) {
						// set the magic value to the number corresponding to the breakpoint
						value = this.props[prop].breakpoints[key];
					}
				}
			}
		}

		return value;
	}

	reRender() {
		// console.log("RERENDER!!!");
		if(this.mounted) {
			this.forceUpdate();
		}
	}

	render() {
		// If the ref "pyramid" exists, then an empty Pyramid has been mounted.
		// We can now determine the width of the Pyramid.
		if(this.refs.pyramid) {
			// Measure the width of the Pyramid and store it in state.
			this.pyramidWidth = this.refs.pyramid.clientWidth;
		}

		let pyramidStyle = Object.assign({}, this.style);
		// If the Pyramid has a style property set,
		// assign it over the initial styling.
		if(this.props.style){
			pyramidStyle = Object.assign(pyramidStyle, this.props.style);
		}

		// If the width of the Pyramid is undefined (which it will be on first render pass),
		// or if there are no elements
		// render out an empty Pyramid.
		if((this.state && !this.pyramidWidth) || !this.props.children || this.props.children.length === 0) {
			// If this.props.scroller is false, make the Pyramid eventually overflow the scroller, 
			// Assuming that if the scroller is not window, it will at least have the same height as window.
			// This is so that getScroller() can determine the scroller.
			if(this.props.scroller === false) {
				pyramidStyle = Object.assign(pyramidStyle, {
					height: window.innerHeight + 1 + "px"
				});
			}

			return (
				<div ref="pyramid" style={pyramidStyle} {...this.classes()}></div>
			)
		}

		// Get responsive prop values
		let numberOfColumns = this.getResponsivePropValue("numberOfColumns");
		let magicValue = this.getResponsivePropValue("magicValue");
		let padding = this.getResponsivePropValue("padding");
		let extraPaddingTop = this.getResponsivePropValue("extraPaddingTop");
		let extraPaddingBottom = this.getResponsivePropValue("extraPaddingBottom");
		let gutter = this.getResponsivePropValue("gutter");

		// Define class for elements using BEMHelper (defaults to pyramid__element)
		let elementClassName = this.classes("element").className;

		// Define the width of the elements
		// All the elements get the same width, (pyramidWidth - Gutters - Padding) / Cols.
		let elementWidth = (this.pyramidWidth - (numberOfColumns - 1) * gutter - 2 * padding) / numberOfColumns;

		let maxBottom = 0;

		// Make sure children is an array even when it's only one child
		const children = this.props.children.length ? this.props.children : [this.props.children];

		// Let's create The Elements of the Pyramid.
		// ("The Elements of the Pyramid"? Lol, sound like a sequel to Luc Besson's "The Fifth Element" ^^)

		// Let's start by doing some necessary checks
		let elements = children.filter( element => {
			if(!element.props.width || !element.props.height) {
				switch(element.type) {
					case "img":
					case "video":
					case "audio":
					case "object":
					case "iframe":
						throw new Error("The original width and height of a media element (img, video, audio, object, iframe) should be supplied. This is because Pyramid needs to calculate the aspect ratio before the media has loaded. Otherwise Pyramid needs to measure the element once the resource has loaded = not optimal. Tough love <3");

					default:
						return true;
				}
			} else {
				return true;
			}
		});

		let elementsToRender = [];

		for (var index = 0; index < elements.length; index++) {
			let element = elements[index];
			let key = element.key || index;

			// Declare the height of the element.
			let elementHeight;

			// If available, use the height in props, to calculate height
			if(element.props.height) {
				elementHeight = (elementWidth / element.props.width) * element.props.height;
			}
			// If the dimensions of the element have been measured
			else if(this.state.measurements[key]) {
				// use measurements to determine height
				elementHeight = this.state.measurements[key].height;
			} 
			// Uknown height
			else {
				elementHeight = "auto";
			} 

			// Let's set the inital props using what we know thus far.
			let elementProps = {};

			elementProps = Object.assign(elementProps, {
				top: padding + extraPaddingTop,
				left: padding,
				width: elementWidth,
				height: elementHeight,
				pyramidWidth: this.getScroller().clientWidth,
				pyramidHeight: this.getScroller().clientHeight,
				inView: (this.allElementProps[index] && this.allElementProps[index].inView) || index === parseInt(this.state.zoomIndex),
				zoomTransition: this.props.zoomTransition ? this.props.zoomTransition : null,
				index: key,
				erd: this.erd,
				onResize: this.updateMeasurements.bind(this)
			});

			// Give the element some extra props if it is zoomable
			if(element.props.zoomable) {
				elementProps = Object.assign(elementProps, {
					onWillZoomIn: this.willZoomIn.bind(this),
					onWillZoomOut: this.willZoomOut.bind(this),
					onDidZoomIn: this.didZoomIn.bind(this),
					onDidZoomOut: this.didZoomOut.bind(this),
					pyramidScrollTop: this.getScrollTop()
				});

				// Disable zoomability if the pyramid is already zoomed in
				if(this.state.zoomedIn) {
					elementProps.zoomable = false;
				}
			}

			// If the element is NOT in the first row
			if(index >= numberOfColumns) {
				let elementAbove = this.allElementProps[index - numberOfColumns];

				if(elementAbove) {
					elementProps.top = elementAbove.top + elementAbove.height + gutter;
				}
			}

			// If the element is NOT the first element in a row
			if(index % numberOfColumns > 0) {
				let elementToTheLeft = this.allElementProps[index - 1];

				if(elementToTheLeft) {
					elementProps.left = elementToTheLeft.left + elementToTheLeft.width + gutter;
				}
			}

			// Check if the element is in view
			if(this.isInView(elementProps.top, elementProps.height, magicValue)) {
				elementProps.inView = true;
			} else if(this.props.derenderIfNotInViewAnymore && this.state.zoomedOut) {
				elementProps.inView = false;
			}

			// Save the element properties to an array in state.
			// This saved me a lot of headache. Pun intended.
			this.allElementProps[index] = Object.assign({}, elementProps);

			if(elementProps.height !== "auto") {
				maxBottom = Math.max(maxBottom, elementProps.top + elementProps.height);
			}

			// Finally! Let's return our pyramid element. 
			elementsToRender.push(
				<PyramidElement ref={"element" + index} className={elementClassName} key={key} {...elementProps}>
					{element}
				</PyramidElement>
			);

			if(elementProps.height === "auto" && !this.state.measurements[key]) {
				// let this be the last element to render for now
				// we need to let it mount so that we can determine its dimensions
				break;
			}
		};

		// A lil' bit of hax doesn't hurt anyone
		// This ensures that there is a bottom padding
		// FAQ:
		// - Q: Why not just padding-bottom: padding?
		// - A: Does not work. Absolute positioned elements.
		// - Q: Have you tried margin-bottom on the pyramidElements of the last row?
		// - A: Yepp, didn't work in all browsers
		// - Q: Okay... Have you tried...
		// - A: Shhh! This works, OKAY!? ¯\(°_o)/¯
		let bottomPadding = (
			<div style={{width:"100%", height:maxBottom + padding + extraPaddingBottom, position: "absolute", display: "block", zIndex: "-1000"}}></div>
		);

		if(this.props.scroller === true) {
			pyramidStyle = Object.assign(pyramidStyle, {
				// height: "100%",
				overflowY: "auto",
				MsOverflowStyle: "-ms-autohiding-scrollbar",
				WebkitOverflowScrolling: "touch"
			});
		} else {
			pyramidStyle = Object.assign(pyramidStyle, {
				height: maxBottom + padding
			});
		}

		pyramidStyle = Object.assign(pyramidStyle, {
			overflowY: this.state.zoomingIn || this.state.zoomedIn ? "hidden" : "auto" 
		});

		let pyramidClassesOptions = {
			modifiers: {
				"zoomedIn": this.state.zoomedIn,
				"zoomedOut": this.state.zoomedOut,
				"zoomingIn": this.state.zoomingIn,
				"zoomingOut": this.state.zoomingOut
			}
		};

		// Now that we have The Elements of the Pyramid™®
		// let us render the Pyramid.
		return (
			<div ref="pyramid" style={pyramidStyle} {...this.classes(pyramidClassesOptions)}>
				{elementsToRender}
				{bottomPadding}
			</div>
		);
	}
}