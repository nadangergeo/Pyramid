import React from "react";
import BEMHelper from "react-bem-helper";
import getUnit from "get-unit";
import elementResizeDetector from "element-resize-detector";
import throttle from "lodash.throttle";

import PyramidElement from "./PyramidElement";

export default class Pyramid extends React.Component {
    static propTypes = { 
        numberOfColumns: React.PropTypes.object,
        magicValues: React.PropTypes.object,
        className: React.PropTypes.string,
        gutter: React.PropTypes.number,
        transition: React.PropTypes.string,
        derenderIfNotInViewAnymore: React.PropTypes.bool,
        style: React.PropTypes.object,
        onElementClick: React.PropTypes.func
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
        transition: "none",
        derenderIfNotInViewAnymore: false
    };

    constructor(props) {
        super(props);

        // Create a elementResizeDetector.
        this.erd = elementResizeDetector({strategy: "scroll"});

        // Create a BEMHelper.
        this.classes = new BEMHelper(props.className);

        // Create initial state.
        this.state = {
            pyramidWidth: null,
            allElementProps: []
        }
    }

    reRender() {
        this.forceUpdate();
    }

    componentDidMount() {
        // Trigger rerenderings on resize events, using elementResizeDetector by mister Wnr ^^
        this.erd.listenTo(this.refs.pyramid, this.reRender.bind(this));

        // Trigger rerenderings on scroll events, throttled.
        this.refs.pyramid.addEventListener('scroll', throttle(this.reRender.bind(this), 40), false);
    }

    componentWillUnmount() {
        // Remove all event listeners
        this.erd.removeAllListeners(this.refs.pyramid);
        this.refs.pyramid.removeEventListener('scroll', this.reRender, true);
    }

    render() {
        // If the ref "pyramid" exists, then an empty Pyramid has been mounted.
        // We can now determine the width of the Pyramid.
        if(this.refs.pyramid) {
            // Measure the width of the Pyramid and store it in state.
            this.state.pyramidWidth = this.refs.pyramid.clientWidth;
        }

        // Initial styling
        // Todo: should this be placed in this?
        let pyramidStyle = {
            display: "block",
            position: "relative",
            width: "100%",
            height: "100%",
            clear: "both",
            overflowY: "auto"
        }

        // If the Pyramid has a style property set,
        // assign it over the initial styling.
        if(this.props.style){
            Object.assign(pyramidStyle, this.props.style);
        }

        // If the width of the Pyramid is undefined (which it will be on first render pass),
        // render out an empty Pyramid.
        if(this.state && !this.state.pyramidWidth) {            
            return (
                <div ref="pyramid" style={pyramidStyle} {...this.classes()}></div>
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


        // Let's create The Elements of the Pyramid.
        // ("The Elements of the Pyramid"? Lol, sound like a sequel to Luc Besson's "The Fifth Element" ^^)
        let elements = this.props.children.filter( element => {
            if(!element.props.width || !element.props.height) {
                switch(element.type) {
                    case "img":
                    case "video":
                    case "iframe":
                        throw new Error("The original width and height of a media element (img, video, iframe) should be supplied. This is because Pyramid needs to calculate the aspect ratio before the media has loaded. Otherwise Pyramid needs to measure the element once the resource has loaded = not optimal. Tough love <3");
                        return false;

                    default:
                        throw new Error("Element type  '" + element.type + "' is not supported. Pyramid, currently only supports img, video and iframe. But don't worry, it will fully support all kinds of elements soon! (the nut is tougher too crack than meets the eye)");
                        return false;
                }
            } else {
                return true;
            }
        }).map( (element, index, elements) => {
            // Define class for elements using BEMHelper (defaults to pyramid__element)
            let elementClassName = this.classes("element").className;

            // Define the width of the elements
            // All the elements get the same width, (pyramidWidth - Gutters) / Cols.
            let elementWidth = (this.state.pyramidWidth - (numberOfColumns + 1) * this.props.gutter ) / numberOfColumns;

            // Determine the height of the element.
            let elementHeight = (elementWidth / element.props.width) * element.props.height;

            // Let's set the inital props using what we know thus far.
            let elementProps = {
                top: this.props.gutter,
                left: this.props.gutter,
                width: elementWidth,
                height: elementHeight,
                inView: this.state.allElementProps[index] ? this.state.allElementProps[index].inView : false,
                transition: this.props.transition
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

            // If the element is in the last row
            if(index >= (elements.length - numberOfColumns)) {
                elementProps.marginBottom = this.props.gutter;
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

            // If the Pyramid has the prop 'onElementClick' set,
            // Bind it to the click event of all pyramid elements (event is set on the container, not the element)
            // Can be useful if one wants to give all elements the same event.
            if(this.props.onElementClick) {
                elementProps.onClick = this.handleClick.bind(this, index);
            }

            // Save the element properties to an array in state.
            // This saved me a lot of headache. Pun intended.
            this.state.allElementProps[index] = elementProps;

            // Finally! Let's return our pyramid element. 
            return (
                <PyramidElement className={elementClassName} key={index} {...elementProps}>
                    {element}
                </PyramidElement>
            )
        });

        // Now that we have The Elements of the Pyramid™®
        // let us render the Pyramid.
        return (
            <div ref="pyramid" style={pyramidStyle} {...this.classes()}>
                {elements}
            </div>
        );
    }

    handleClick(index, event) {
        if(this.props.onElementClick) {
            this.props.onElementClick(this.state.allElementProps[index], event);
        }
    }

}