import React from "react";
import ReactDOM from "react-dom";
import BEMHelper from "react-bem-helper";
import getUnit from "get-unit";
import elementResizeDetector from "element-resize-detector";
import throttle from "lodash.throttle";
import transitionUtility from "transition-utility";

import PyramidElement from "./PyramidElement";

export default class Pyramid extends React.PureComponent {
    static propTypes = { 
        numberOfColumns: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.object]),
        magicValue: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.object]),
        className: React.PropTypes.string,
        gutter: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.object]),
        padding: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.object]),
        transition: React.PropTypes.string,
        derenderIfNotInViewAnymore: React.PropTypes.bool,
        style: React.PropTypes.object,
        onElementClick: React.PropTypes.func,
        zoomable: React.PropTypes.bool,
        scroller: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.object])
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
        className: "pyramid",
        gutter: 20,
        padding: 20,
        transition: "none",
        derenderIfNotInViewAnymore: false,
        zoomable: false,
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

        // If the Pyramid has a style property set,
        // assign it over the initial styling.
        if(props.style){
            this.style = Object.assign(this.style, props.style);
        }

        this.pyramidWidth = null;
        this.allElementProps = [];
        
        // Create initial state.
        this.state = {
            zoomedIn: false,
            zoomingIn: false,
            zoomingOut: false,
            zoomElementIndex: null,
            measurements: {}
        }
    }

    componentDidMount() {
        this.mounted = true;

        // Trigger rerenderings on resize events, using elementResizeDetector by mister Wnr ^^
        this.erd.listenTo(false, this.refs.pyramid, this.handleResize.bind(this));

        // Trigger rerenderings on scroll events, throttled.
        this.scrollEventFunction = this.handleScroll.bind(this);
        this.throttledScrollEventFunction = throttle(this.scrollEventFunction, 50);
        this.getScroller().addEventListener('scroll', this.throttledScrollEventFunction, true);
    }

    componentWillUnmount() {
        this.mounted = false;

        // Remove all event listeners
        this.erd.removeAllListeners(this.refs.pyramid);
        this.getScroller().removeEventListener('scroll', this.throttledScrollEventFunction, true);
    }

    // WIP
    componentDidUpdate() {
        // console.log("componentDidUpdate");

        if(this.state.zoomingIn) {
            ReactDOM.findDOMNode(this.refs["element" + this.state.zoomElementIndex]).addEventListener(transitionUtility.getEndEvent(), this.zoomInEnd.bind(this));
        } else if(this.state.zoomingOut) {
            ReactDOM.findDOMNode(this.refs["element" + this.state.zoomElementIndex]).addEventListener(transitionUtility.getEndEvent(), this.zoomOutEnd.bind(this));
        }

        // console.log("zoomedIn", this.state.zoomedIn);
        // console.log("zoomingIn", this.state.zoomingIn);
        // console.log("zoomingOut", this.state.zoomingOut);
    }

    getScroller() {
        if(this.scroller) {
            return this.scroller;
        } else if(typeof this.props.scroller === "object") {
            return this.scroller = this.props.scroller;
        } else if(this.props.scroller === true) {
            return this.scroller = this.refs.pyramid;
        } else {
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

    handleElementClick(index, event) {
        if(this.props.onElementClick) {
            this.props.onElementClick(this.allElementProps[index], event);
        }
    }

    handleResize(event) {
        this.reRender();
    }

    handleScroll(event) {
        this.reRender();
    }

    isInView(top, height, magicValue) {
        // If the element is in view (or close to using magic value).
        // One could say this is mathemagic.

        let scroller = this.getScroller();
        let magic = (magicValue * this.refs.pyramid.offsetHeight);
        let scrollerHeight = scroller.offsetHeight || scroller.innerHeight;
        let offsetTop = this.props.scroller ? 0 : this.refs.pyramid.offsetTop;
        let scrollTop = scroller === window ? scroller.pageYOffset : scroller.scrollTop;

        if(
            ( top + magic > scrollTop - offsetTop
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

    zoom(index, event) {
        event.stopPropagation();

        console.log("ZOOM!", index);

        if(!this.state.zoomedIn) {
            this.setState({
                zoomingIn: true,
                zoomingOut: false,
                zoomElementIndex: index
            });
        } else {
            this.setState({
                zoomedIn: false,
                zoomingOut: true
            });
        }
    }

    zoomInEnd(event) {
        if (event.propertyName === "width") {
            console.log("zoomInEnd!");

            this.setState({
                zoomedIn: true,
                zoomingIn: false,
                zoomingOut: false
            });
        }
    }

    zoomOutEnd(event) {
        if (event.propertyName === "width") {
            console.log("zoomOutEnd!");

            this.setState({
                zoomedIn: false,
                zoomingIn: false,
                zoomingOut: false
            });

            ReactDOM.findDOMNode(this.refs["element" + this.state.zoomElementIndex]).removeEventListener(transitionUtility.getEndEvent(), this.zoomOutEnd.bind(this));
            ReactDOM.findDOMNode(this.refs["element" + this.state.zoomElementIndex]).removeEventListener(transitionUtility.getEndEvent(), this.zoomInEnd.bind(this));
        }
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

        // If the width of the Pyramid is undefined (which it will be on first render pass),
        // or if there are no elements
        // render out an empty Pyramid.
        if((this.state && !this.pyramidWidth) || this.props.children.length === 0) {
            let style = this.style;

            // If this.props.scroller is false, make the Pyramid eventually overflow the scroller, 
            // Assuming that if the scroller is not window, it will at least have the same height as window.
            // This is so that getScroller() can determine the scroller.
            if(this.props.scroller === false) {
                style = Object.assign(style, {
                    height: window.innerHeight + 1 + "px"
                });
            }

            return (
                <div ref="pyramid" style={style} {...this.classes()}></div>
            )
        }

        // Let's figure out how many columns the Pyramid should have.
        let numberOfColumns;
        if(typeof this.props.numberOfColumns === "number") {
            numberOfColumns = this.props.numberOfColumns;
        } else {
            // Let it first be defined as the default value.
            numberOfColumns = this.props.numberOfColumns.default;
            // Then let us iterate through all the breakpoints.
            for(let key in this.props.numberOfColumns.breakpoints) {
                if (this.props.numberOfColumns.breakpoints.hasOwnProperty(key)) {
                    // What unit was the breakpoint defined with?
                    let unit = getUnit(key);

                    // Pyramid only supports pixels atm.
                    // Todo: support ems and % ?
                    if(unit !== "px") {
                        throw new Error("Pyramid does not support the unit '" + unit + "' for breakpoints in the property numberOfColumns. You could always help out to implement it and make a pull request ^^ Cheers!");
                    }

                    // If the width of the Pyramid is greater or equal to the breakpoint, then...
                    if(this.pyramidWidth >= parseInt(key, 10)) {
                        // set the number of columns to the number corresponding to the breakpoint
                        numberOfColumns = this.props.numberOfColumns.breakpoints[key];
                    }
                }
            }
        }

        // Let's determine the magic value.
        let magicValue;
        if(typeof this.props.magicValue === "number") {
            magicValue = this.props.magicValue;
        } else {
            // Let the magic value be intially defined as the default value.
            magicValue = this.props.magicValue.default;
            // Then let us iterate through all the breakpoints.
            for(let key in this.props.magicValue.breakpoints) {
                if (this.props.magicValue.breakpoints.hasOwnProperty(key)) {
                    // What unit was the breakpoint defined with?
                    let unit = getUnit(key);

                    // Pyramid only supports pixels atm.
                    // Todo: support ems and % ?
                    if(unit !== "px") {
                        throw new Error("Pyramid does not support the unit '" + unit + "' for breakpoints in the property magicValue. You could always help out to implement it and make a pull request ^^ Cheers!");
                    }

                    // If the width of the Pyramid is greater or equal to the breakpoint, then...
                    if(this.pyramidWidth >= parseInt(key, 10)) {
                        // set the magic value to the number corresponding to the breakpoint
                        magicValue = this.props.magicValue.breakpoints[key];
                    }
                }
            }
        }

        // Let's determine the padding.
        let padding;
        if(typeof this.props.padding === "number") {
            padding = this.props.padding;
        } else {
            // Let the padding be intially defined as the default value.
            padding = this.props.padding.default;
            // Then let us iterate through all the breakpoints.
            for(let key in this.props.padding.breakpoints) {
                if (this.props.padding.breakpoints.hasOwnProperty(key)) {
                    // What unit was the breakpoint defined with?
                    let unit = getUnit(key);

                    // Pyramid only supports pixels atm.
                    // Todo: support ems and % ?
                    if(unit !== "px") {
                        throw new Error("Pyramid does not support the unit '" + unit + "' for breakpoints in the property padding. You could always help out to implement it and make a pull request ^^ Cheers!");
                    }

                    // If the width of the Pyramid is greater or equal to the breakpoint, then...
                    if(this.pyramidWidth >= parseInt(key, 10)) {
                        // set the magic value to the number corresponding to the breakpoint
                        padding = this.props.padding.breakpoints[key];
                    }
                }
            }
        }

        // Let's determine the gutter.
        let gutter;
        if(typeof this.props.gutter === "number") {
            gutter = this.props.gutter;
        } else {
            // Let the gutter be intially defined as the default value.
            gutter = this.props.gutter.default;
            // Then let us iterate through all the breakpoints.
            for(let key in this.props.gutter.breakpoints) {
                if (this.props.gutter.breakpoints.hasOwnProperty(key)) {
                    // What unit was the breakpoint defined with?
                    let unit = getUnit(key);

                    // Pyramid only supports pixels atm.
                    // Todo: support ems and % ?
                    if(unit !== "px") {
                        throw new Error("Pyramid does not support the unit '" + unit + "' for breakpoints in the property gutter. You could always help out to implement it and make a pull request ^^ Cheers!");
                    }

                    // If the width of the Pyramid is greater or equal to the breakpoint, then...
                    if(this.pyramidWidth >= parseInt(key, 10)) {
                        // set the magic value to the number corresponding to the breakpoint
                        gutter = this.props.gutter.breakpoints[key];
                    }
                }
            }
        }

        // Define class for elements using BEMHelper (defaults to pyramid__element)
        let elementClassName = this.classes("element").className;

        // Define the width of the elements
        // All the elements get the same width, (pyramidWidth - Gutters - Padding) / Cols.
        let elementWidth = (this.pyramidWidth - (numberOfColumns - 1) * gutter - 2 * padding) / numberOfColumns;

        let maxBottom = 0;

        // Let's create The Elements of the Pyramid.
        // ("The Elements of the Pyramid"? Lol, sound like a sequel to Luc Besson's "The Fifth Element" ^^)

        // Let's start by doing some necessary checks
        let elements = this.props.children.filter( element => {
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

            // Declare the height of the element.
            let elementHeight;

            // If the dimensions of the element have been measured
            if(this.state.measurements[index]) {
                // use measurements to determine height
                elementHeight = this.state.measurements[index].height;
            } 
            // If height prop has not been set
            else if(!element.props.height) {
                elementHeight = "auto";
            } 
            // otherwise, use the height in props
            else {
                elementHeight = (elementWidth / element.props.width) * element.props.height;
            }

            // Let's set the inital props using what we know thus far.
            let elementProps = {};

            // If the Pyramid is zoomable
            if(this.props.zoomable) {
                elementProps.onClick = this.zoom.bind(this, index);
            }

            elementProps = Object.assign(elementProps, {
                top: padding,
                left: padding,
                width: elementWidth,
                height: elementHeight,
                inView: this.allElementProps[index] ? this.allElementProps[index].inView : false,
                transition: this.props.transition,
                index: index,
                erd: this.erd,
                onResize: this.updateMeasurements.bind(this)
            });

            if(index === this.state.zoomElementIndex) {
                if(this.state.zoomingOut) {
                    elementProps.zIndex = 1000;
                }

                elementProps = Object.assign(elementProps, {
                    zoomedIn: this.state.zoomedIn,
                    zoomingIn: this.state.zoomingIn,
                    zoomingOut: this.state.zoomingOut
                });
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
            } else if(this.props.derenderIfNotInViewAnymore) {
                elementProps.inView = false;
            }

            // Otherwise, if the Pyramid has the prop 'onElementClick' set,
            // Bind it to the click event of all pyramid elements (note: event is set on the container, not the element)
            // Can be useful if one wants to give all elements the same event.
            // if(this.props.onElementClick) {
            //     elementProps.onClick = this.handleElementClick.bind(this, index);
            // }

            // Save the element properties to an array in state.
            // This saved me a lot of headache. Pun intended.
            this.allElementProps[index] = Object.assign({}, elementProps);

            if(elementProps.height !== "auto") {
                maxBottom = Math.max(maxBottom, elementProps.top + elementProps.height);
            }

            if((this.state.zoomedIn || this.state.zoomingIn) && index === this.state.zoomElementIndex) {
                elementProps = Object.assign(elementProps, {
                    top: this.refs.pyramid.scrollTop,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    transition: this.props.transition,
                    zoomedIn: this.state.zoomedIn,
                    zoomingIn: this.state.zoomingIn,
                    zIndex: 1000
                });
            }

            // Finally! Let's return our pyramid element. 
            elementsToRender.push(
                <PyramidElement ref={"element" + index} className={elementClassName} key={index} {...elementProps}>
                    {element}
                </PyramidElement>
            );

            if(elementProps.height === "auto" && !this.state.measurements[index]) {
                // let this be the last element to render for now
                // we need to let it mount so that we can determine its dimensions
                break;
            }
        };

        // A lil' bit of hax doesn't hurt anyone
        // This ensures that their is a bottom padding
        // FAQ:
        // - Q: Why not just padding-bottom: padding?
        // - A: Does not work. Absolute positioned elements.
        // - Q: Have you tried margin-bottom on the pyramidElements of the last row?
        // - A: Yepp, didn't work in all browsers
        // - Q: Okay... Have you tried...
        // - A: Shhh! This works, OKAY!? ¯\(°_o)/¯
        let bottomPadding = (
            <div style={{width:"100%", height:maxBottom + padding, position: "absolute", display: "block", zIndex: "-1000"}}></div>
        );

        let pyramidStyle = Object.assign({}, this.style);

        if(this.props.scroller === true) {
            pyramidStyle = Object.assign(pyramidStyle, {
                height: "100%",
                overflowY: "auto",
                MsOverflowStyle: "-ms-autohiding-scrollbar",
                WebkitOverflowScrolling: "touch"
            });
        } else {
            pyramidStyle = Object.assign(pyramidStyle, {
                height: maxBottom + padding
            });
        }

        if(this.state.zoomingIn || this.state.zoomedIn) {
            pyramidStyle = Object.assign(pyramidStyle, {
                zIndex: 1000,
                height: "100%",
                overflowY: "hidden"
            });
        }

        // Now that we have The Elements of the Pyramid™®
        // let us render the Pyramid.
        return (
            <div ref="pyramid" style={pyramidStyle} {...this.classes()}>
                {elementsToRender}
                {bottomPadding}
            </div>
        );
    }

    // Measurement methods
    // ---------------------------

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

        // console.log("Measured index:", index);
        // console.log("Measured width:", width);
        // console.log("Measured height:", height);
    }
}