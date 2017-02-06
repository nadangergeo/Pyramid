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
        numberOfColumns: React.PropTypes.object,
        magicValues: React.PropTypes.object,
        className: React.PropTypes.string,
        gutter: React.PropTypes.number,
        padding: React.PropTypes.number,
        transition: React.PropTypes.string,
        derenderIfNotInViewAnymore: React.PropTypes.bool,
        style: React.PropTypes.object,
        onElementClick: React.PropTypes.func,
        zoomable: React.PropTypes.bool
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
        magicValues: {
            default: 0
        },
        className: "pyramid",
        gutter: 20,
        padding: 20,
        transition: "none",
        derenderIfNotInViewAnymore: false,
        zoomable: false
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
            height: "100%",
            clear: "both",
            overflowY: "auto",
            MsOverflowStyle: "-ms-autohiding-scrollbar",
            WebkitOverflowScrolling: "touch"
        }

        // If the Pyramid has a style property set,
        // assign it over the initial styling.
        if(props.style){
            this.style = Object.assign(this.style, props.style);
        }

        // Create initial state.
        this.state = {
            pyramidWidth: null,
            allElementProps: [],
            measurements: {},
            zoomedIn: false,
            zoomingIn: false,
            zoomingOut: false,
            zoomElementIndex: null
        }
    }

    componentDidMount() {
        // Trigger rerenderings on resize events, using elementResizeDetector by mister Wnr ^^
        this.erd.listenTo(false, this.refs.pyramid, this.handleResize.bind(this));

        // Trigger rerenderings on scroll events, throttled.
        this.refs.pyramid.addEventListener('scroll', throttle(this.handleScroll.bind(this), 50), false);
    }

    componentWillUnmount() {
        // Remove all event listeners
        this.erd.removeAllListeners(this.refs.pyramid);
        this.refs.pyramid.removeEventListener('scroll', this.handleScroll, true);
    }

    // WIP
    componentDidUpdate() {
        // console.log("componentDidUpdate");

        if(typeof this.state.measurementsNeeded === "number") {
            if(!this.allMeasurmentsHaveBeenMade() || this.state.remeasurementsNeeded) {
                this.makeMeasurements();
            }
        }

        if(this.state.zoomingIn) {
            ReactDOM.findDOMNode(this.refs["element" + this.state.zoomElementIndex]).addEventListener(transitionUtility.getEndEvent(), this.zoomInEnd.bind(this));
        } else if(this.state.zoomingOut) {
            ReactDOM.findDOMNode(this.refs["element" + this.state.zoomElementIndex]).addEventListener(transitionUtility.getEndEvent(), this.zoomOutEnd.bind(this));
        }

        // console.log("zoomedIn", this.state.zoomedIn);
        // console.log("zoomingIn", this.state.zoomingIn);
        // console.log("zoomingOut", this.state.zoomingOut);
    }

    handleElementClick(index, event) {
        if(this.props.onElementClick) {
            this.props.onElementClick(this.state.allElementProps[index], event);
        }
    }

    handleResize(event) {
        this.state.remeasurementsNeeded = true;
        this.reRender();

        // this also works, but the code above is more explicit, no?
        // this.setState({
        //     remeasurementsNeeded: true
        // });
    }

    handleScroll(event) {
        this.reRender();
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
        console.log("zoomInEnd!");

        this.setState({
            zoomedIn: true,
            zoomingIn: false,
            zoomingOut: false
        });
    }

    zoomOutEnd(event) {
        console.log("zoomOutEnd!");

        this.setState({
            zoomedIn: false,
            zoomingIn: false,
            zoomingOut: false
        });

        ReactDOM.findDOMNode(this.refs["element" + this.state.zoomElementIndex]).removeEventListener(transitionUtility.getEndEvent(), this.zoomOutEnd.bind(this));
        ReactDOM.findDOMNode(this.refs["element" + this.state.zoomElementIndex]).removeEventListener(transitionUtility.getEndEvent(), this.zoomInEnd.bind(this));
    }

    reRender() {
        // console.log("RERENDER!!!");
        this.forceUpdate();
    }

    render() {
        // If the ref "pyramid" exists, then an empty Pyramid has been mounted.
        // We can now determine the width of the Pyramid.
        if(this.refs.pyramid) {
            // Measure the width of the Pyramid and store it in state.
            this.state.pyramidWidth = this.refs.pyramid.clientWidth;
        }

        // If the width of the Pyramid is undefined (which it will be on first render pass),
        // render out an empty Pyramid.
        if(this.state && !this.state.pyramidWidth) {            
            return (
                <div ref="pyramid" style={this.style} {...this.classes()}></div>
            )
        }

        // Let's figure out how many columns the Pyramid should have.
        // Let it first be defined as the default value.
        let numberOfColumns = this.props.numberOfColumns.default;
        // Then let us iterate through all the breakpoints.
        for(let key in this.props.numberOfColumns.breakpoints) {
            // What unit was the breakpoint defined with?
            let unit = getUnit(key);

            // Pyramid only supports pixels atm.
            // Todo: support ems and % ?
            if(unit !== "px") {
                throw new Error("Pyramid does not support the unit '" + unit + "' in the property numberOfColumns. You could always help out to implement it and make a pull request ^^ Cheers!");
            }

            // If the width of the Pyramid is greater or equal to the breakpoint, then...
            if(this.state.pyramidWidth >= parseInt(key)) {
                // set the number of columns to the number corresponding to the breakpoint
                numberOfColumns = this.props.numberOfColumns.breakpoints[key];
            }
        }

        // Let the magic value be intially defined as the default value.
        let magicValue = this.props.magicValues.default;
        // Then let us iterate through all the breakpoints.
        for(let key in this.props.magicValues.breakpoints) {
            // What unit was the breakpoint defined with?
            let unit = getUnit(key);

            // Pyramid only supports pixels atm.
            // Todo: support ems and % ?
            if(unit !== "px") {
                throw new Error("Pyramid does not support the unit '" + unit + "' in the property magicValues. You could always help out to implement it and make a pull request ^^ Cheers!");
            }

            // If the width of the Pyramid is greater or equal to the breakpoint, then...
            if(this.state.pyramidWidth >= parseInt(key)) {
                // set the magic value to the number corresponding to the breakpoint
                magicValue = this.props.magicValues.breakpoints[key];
            }
        }

        // Define class for elements using BEMHelper (defaults to pyramid__element)
        let elementClassName = this.classes("element").className;

        // Define the width of the elements
        // All the elements get the same width, (pyramidWidth - Gutters - Padding) / Cols.
        let elementWidth = (this.state.pyramidWidth - (numberOfColumns - 1) * this.props.gutter - 2 * this.props.padding) / numberOfColumns;

        // Do we need to make some intial measurements?
        // We need to know the height of elements with a dynamic/unknown aspect ratio before our first real render.
        if(typeof this.state.measurementsNeeded === "undefined" || !this.allMeasurmentsHaveBeenMade()) {
            return (
                <div ref="pyramid" style={this.style} {...this.classes()}>
                    {this.getElementsForMeasurment(elementWidth, elementClassName)}
                </div>
            );
        }

        //DERP
        // if(this.state.zoomedIn) {
        //     let index = this.state.zoomElementIndex;
        //     let element = this.props.children[index];

        //     let elementProps = {
        //         position: "fixed",
        //         top: 0,
        //         left: 0,
        //         width: "100%",
        //         height: "100%",
        //         inView: true,
        //         transition: this.props.transition,
        //         zoomedIn: true
        //     };

        //     let pyramidStyle = Object.assign({}, this.style);
        //     pyramidStyle = Object.assign(pyramidStyle, {
        //         zIndex: 1000,
        //         top: 0,
        //         height: "100%"
        //     })

        //     // If the Pyramid is zoomable
        //     if(this.props.zoomable) {
        //         elementProps.onClick = this.zoom.bind(this, index);
        //     }

        //     return (
        //         <div ref="pyramid" style={pyramidStyle} {...this.classes()}>
        //             <PyramidElement ref={"element" + index} className={elementClassName} key={index} {...elementProps}>
        //                 {element}
        //             </PyramidElement>
        //         </div>
        //     )
        // }

        let maxBottom = 0;

        // Let's create The Elements of the Pyramid.
        // ("The Elements of the Pyramid"? Lol, sound like a sequel to Luc Besson's "The Fifth Element" ^^)
        let elements = this.props.children.filter( element => {
            if(!element.props.width || !element.props.height) {
                switch(element.type) {
                    case "img":
                    case "video":
                    case "audio":
                    case "object":
                    case "iframe":
                        throw new Error("The original width and height of a media element (img, video, audio, object, iframe) should be supplied. This is because Pyramid needs to calculate the aspect ratio before the media has loaded. Otherwise Pyramid needs to measure the element once the resource has loaded = not optimal. Tough love <3");
                        return false;

                    default:
                        // WIP
                        return true;
                        throw new Error("Element type  '" + element.type + "' is not supported. Pyramid, currently only supports img, video and iframe. But don't worry, it will fully support all kinds of elements soon! (the nut is tougher too crack than meets the eye)");
                        return false;
                }
            } else {
                return true;
            }
        }).map( (element, index, elements) => {
            // Declare the height of the element.
            let elementHeight;

            // If the dimensions of the element have been measured
            if(this.state.measurements[index]) {
                // get measurments
                let measuredWidth = this.state.measurements[index].width;
                let measuredHeight = this.state.measurements[index].height;

                // use measurements to determine height
                elementHeight = (elementWidth / measuredWidth) * measuredHeight;

                // just use measuredHeight directly???
                // console.log("same same?", elementHeight === measuredHeight);
            } else {
                // otherwise, calculate height using the dimensions in props
                // which MUST exist in this scope. The logic holds, trust me.
                elementHeight = (elementWidth / element.props.width) * element.props.height;
            }

            // Let's set the inital props using what we know thus far.
            let elementProps = {};

            // If the Pyramid is zoomable
            if(this.props.zoomable) {
                elementProps.onClick = this.zoom.bind(this, index);
            }

            if((this.state.zoomedIn || this.state.zoomingIn) && index === this.state.zoomElementIndex) {
                elementProps = Object.assign(elementProps, {
                    position: "fixed",
                    top: this.refs.pyramid.scrollTop,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    inView: true,
                    transition: this.props.transition,
                    zoomedIn: this.state.zoomedIn,
                    zoomingIn: this.state.zoomingIn,
                    zIndex: 1000
                });

                return (
                    <PyramidElement ref={"element" + index} className={elementClassName} key={index} {...elementProps}>
                        {element}
                    </PyramidElement>
                )
            } else {
                elementProps = Object.assign(elementProps, {
                    top: this.props.padding,
                    left: this.props.padding,
                    width: elementWidth,
                    height: elementHeight,
                    inView: this.state.allElementProps[index] ? this.state.allElementProps[index].inView : false,
                    transition: this.props.transition,
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
                    let elementAbove = this.state.allElementProps[index - numberOfColumns];

                    if(elementAbove) {
                        elementProps.top = elementAbove.top + elementAbove.height + this.props.gutter;
                    }
                } 

                // If the element is NOT the first element in a row
                if(index % numberOfColumns > 0) {
                    let elementToTheLeft = this.state.allElementProps[index - 1];

                    if(elementToTheLeft) {
                        elementProps.left = elementToTheLeft.left + elementToTheLeft.width + this.props.gutter;
                    }
                }

                // If the element is in view (or close to using magic value).
                // One could say this is mathemagic.
                if(
                    ( elementProps.top + (magicValue * this.refs.pyramid.offsetHeight) > this.refs.pyramid.scrollTop
                      &&
                      elementProps.top < ( this.refs.pyramid.scrollTop + this.refs.pyramid.offsetHeight) + (magicValue * this.refs.pyramid.offsetHeight)
                    )
                    ||
                    ( (elementProps.top + elementProps.height) + (magicValue * this.refs.pyramid.offsetHeight) > this.refs.pyramid.scrollTop
                      &&
                      elementProps.top + elementProps.height < (this.refs.pyramid.scrollTop + this.refs.pyramid.offsetHeight) + (magicValue * this.refs.pyramid.offsetHeight)
                    )
                ) {
                    elementProps.inView = true;
                } else if(this.props.derenderIfNotInViewAnymore) {
                    elementProps.inView = false;
                }
            }

            if(typeof element.type === "function") {
                elementProps.erd = this.erd;
            }

            // Otherwise, if the Pyramid has the prop 'onElementClick' set,
            // Bind it to the click event of all pyramid elements (note: event is set on the container, not the element)
            // Can be useful if one wants to give all elements the same event.
            else if(this.props.onElementClick) {
                elementProps.onClick = this.handleElementClick.bind(this, index);
            }

            // Save the element properties to an array in state.
            // This saved me a lot of headache. Pun intended.
            this.state.allElementProps[index] = elementProps;

            maxBottom = Math.max(maxBottom, elementProps.top + elementProps.height);

            // Finally! Let's return our pyramid element. 
            return (
                <PyramidElement ref={"element" + index} className={elementClassName} key={index} {...elementProps}>
                    {element}
                </PyramidElement>
            )
        });

        // A lil' bit of hax doesn't hurt anyone
        // This ensures that their is a bottom padding
        // FAQ:
        // - Q: Why not just padding-bottom: this.props.padding?
        // - A: Does not work. Absolute positioned elements.
        // - Q: Have you tried margin-bottom on the pyramidElements of the last row?
        // - A: Yepp, didn't work in all browsers
        // - Q: Okay... Have you tried...
        // - A: SHUT UP! This works, OKAY!?
        let bottomPadding = (
            <div style={{width:"100%", height:maxBottom + this.props.padding, position: "absolute", display: "block", zIndex: "-1000"}}></div>
        );

        let pyramidStyle = Object.assign({}, this.style);
        if(this.state.zoomingIn || this.state.zoomedIn) {
            pyramidStyle = Object.assign(pyramidStyle, {
                zIndex: 1000,
                top: 0,
                height: "100%",
                overflowY: "hidden"
            })
        }

        // Now that we have The Elements of the Pyramid™®
        // let us render the Pyramid.
        return (
            <div ref="pyramid" style={pyramidStyle} {...this.classes()}>
                {elements}
                {bottomPadding}
                {this.getElementsForMeasurment(elementWidth, elementClassName)}
            </div>
        );
    }

    // Measurement methods
    // ---------------------------

    makeMeasurements() {
        // Iterate through the hidden measurement elements
        for (var index = 0; index < this.state.measurementsNeeded; index++) {
            //the ref, same pattern as when made by getElementsForMeasurment()
            let ref = "measurement" + index;
            //get the dom element
            let domElement = ReactDOM.findDOMNode(this.refs[ref]);

            // measure height
            let height = domElement.clientHeight;
            let width = domElement.clientWidth;

            //add measurement
            this.addMeasurement(index, width, height);
        }

        // set remeasurementsNeeded to false, which also triggers a (needed) render
        this.setState({
            remeasurementsNeeded: false
        });
    }

    addMeasurement(index, width, height) {
        // add empty measurement object for element,
        // with index as key
        if(!this.state.measurements[index]) {
            this.state.measurements[index] = {};
        }

        // set width and height props to measurment object
        this.state.measurements[index].width = width;
        this.state.measurements[index].height = height;

        // console.log("Measured index:", index);
        // console.log("Measured width:", width);
        // console.log("Measured height:", height);
        // console.dir(this.state.measurements);
    }

    allMeasurmentsHaveBeenMade() {
        // Todo: is this really needed?
        if(typeof this.state.measurementsNeeded === "undefined") {
            throw new Error("Dont know how many measurments are needed. 'this.state.measurementsNeeded' is undefined.");
            return false;
        }

        // if the measurements needed is equal to the number of measurements made
        if(this.state.measurementsNeeded === Object.keys(this.state.measurements).length) {
            // console.log('allMeasurmentsHaveBeenMade', true);
            return true;
        } else {
            // console.log('allMeasurmentsHaveBeenMade', false);
            return false;
        }
    }

    getElementsForMeasurment(elementWidth, elementClassName) {
        // console.log("getElementsForMeasurment");

        this.state.measurementsNeeded = 0;
        let measurmentElements = [];

        let elementProps = {
            width: elementWidth,
            height: "auto" //to let the browser do the measurement for us
        }

        // Iterate through the elements
        for (let index = 0; index < this.props.children.length; index++) {
            // Get the element
            let element = this.props.children[index];

            // The ref, same pattern as when made by makeMeasurements()
            let ref = "measurement" + index;

            // Does the element need measurements?
            if(!element.props.width || !element.props.height) {
                // Increment measurementsNeeded
                this.state.measurementsNeeded += 1;

                // Create and push hiddden pyramid element for measurement
                measurmentElements.push(
                    <PyramidElement ref={ref} style={{visibility: "hidden", zIndex: -1000}} className={elementClassName} key={index} {...elementProps}>
                        {element}
                    </PyramidElement>
                );
            }
        }

        // Finally, return the hidden elments for measurement
        return measurmentElements;
    }

}