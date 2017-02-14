import React from "react";
import ReactDOM from "react-dom";
import BEMHelper from "react-bem-helper";
import getUnit from "get-unit";
import elementResizeDetector from "element-resize-detector";
import throttle from "lodash.throttle";

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
        scroller: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.object]),
        erd: React.PropTypes.object,
        zoomable: React.PropTypes.bool,
        onWillZoomIn: React.PropTypes.func,
        onWillZoomOut: React.PropTypes.func,
        onDidZoomIn: React.PropTypes.func,
        onDidZoomOut: React.PropTypes.func
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

        this.pyramidWidth = null;
        this.allElementProps = [];
        
        // Create initial state.
        this.state = {
            zoomedIn: false,
            zoomingIn: false,
            zoomingOut: false,
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

    getScrollTop(scroller = this.getScroller()){
        return scroller === window ? scroller.pageYOffset : scroller.scrollTop;
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
        let scrollTop = this.getScrollTop();

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

    willZoomIn() {
            // console.log("willZoomIn!");

            if(typeof this.props.onWillZoomIn === "function") {
                this.props.onWillZoomIn();
            }

            this.setState({
                zoomedIn: false,
                zoomingIn: true,
                zoomingOut: false
            });
    }

    willZoomOut() {
            // console.log("willZoomOut!");

            if(typeof this.props.onWillZoomOut === "function") {
                this.props.onWillZoomOut();
            }

            this.setState({
                zoomedIn: true,
                zoomingIn: false,
                zoomingOut: false
            });
    }

    didZoomIn() {
            // console.log("didZoomIn!");

            if(typeof this.props.onDidZoomIn === "function") {
                this.props.onDidZoomIn();
            }

            this.setState({
                zoomedIn: true,
                zoomingIn: false,
                zoomingOut: false
            });
    }

    didZoomOut() {
            // console.log("didZoomOut!");

            if(typeof this.props.onDidZoomOut === "function") {
                this.props.onDidZoomOut();
            }

            this.setState({
                zoomedIn: false,
                zoomingIn: false,
                zoomingOut: false
            });
    }

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
        if((this.state && !this.pyramidWidth) || this.props.children.length === 0) {
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

            // If available, use the height in props, to calculate height
            if(element.props.height) {
                elementHeight = (elementWidth / element.props.width) * element.props.height;
            }
            // If the dimensions of the element have been measured
            else if(this.state.measurements[index]) {
                // use measurements to determine height
                elementHeight = this.state.measurements[index].height;
            } 
            // Uknown height
            else {
                elementHeight = "auto";
            } 
            

            // Let's set the inital props using what we know thus far.
            let elementProps = {};

            elementProps = Object.assign(elementProps, {
                top: padding,
                left: padding,
                width: elementWidth,
                height: elementHeight,
                inView: this.allElementProps[index] ? this.allElementProps[index].inView : false,
                transition: this.props.transition,
                index: index,
                erd: this.erd,
                onResize: this.updateMeasurements.bind(this),
                zoomable: this.props.zoomable && (this.props.zoomedIn || typeof this.props.zoomedIn === "undefined")
            });

            if(this.props.zoomable) {
                elementProps = Object.assign(elementProps, {
                    onWillZoomIn: this.willZoomIn.bind(this),
                    onWillZoomOut: this.willZoomOut.bind(this),
                    onDidZoomIn: this.didZoomIn.bind(this),
                    onDidZoomOut: this.didZoomOut.bind(this),
                    pyramidScrollTop: this.getScrollTop()
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

            // Save the element properties to an array in state.
            // This saved me a lot of headache. Pun intended.
            this.allElementProps[index] = Object.assign({}, elementProps);

            if(elementProps.height !== "auto") {
                maxBottom = Math.max(maxBottom, elementProps.top + elementProps.height);
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
        // This ensures that there is a bottom padding
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
                overflowY: "hidden"
            });
        }

        let pyramidClassesOptions = {
            modifiers: {
                "zoomedIn": this.state.zoomedIn,
                "zoomedOut": !this.state.zoomedIn,
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