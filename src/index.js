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
        this.erd = elementResizeDetector({strategy: "scroll"});
        this.classes = new BEMHelper(props.className);
        this.state = {
            pyramidWidth: null,
            allElementProps: []
        }
    }

    reRender() {
        this.forceUpdate();
    }

    componentDidMount() {
        this.erd.listenTo(this.refs.pyramid, this.reRender.bind(this));
        this.refs.pyramid.addEventListener('scroll', throttle(this.reRender.bind(this), 40), false);
    }

    componentWillUnmount() {
        this.erd.removeAllListeners(this.refs.pyramid);
        this.refs.pyramid.removeEventListener('scroll', this.reRender, true);
    }

    render() {
        if(this.refs.pyramid) {
            this.state.pyramidWidth = this.refs.pyramid.clientWidth;
        }

        let pyramidStyle = {
            display: "block",
            position: "relative",
            width: "100%",
            height: "100%",
            clear: "both",
            overflowY: "auto"
        }

        if(this.props.style){
            Object.assign(pyramidStyle, this.props.style);
        }

        if(this.state && !this.state.pyramidWidth) {            
            return (
                <div ref="pyramid" style={pyramidStyle} {...this.classes()}></div>
            )
        }

        let numberOfColumns = this.props.numberOfColumns.default;
        for(key in this.props.numberOfColumns.breakpoints) {
            let unit = getUnit(key);

            if(unit !== "px") {
                throw new Error("Pyramid does not support the unit '" + unit + "' in the property numberOfColumns. You could always help out to implement it and make a pull request ^^ Cheers!");
            }

            if(this.state.pyramidWidth >= parseInt(key)) {
                numberOfColumns = this.props.numberOfColumns.breakpoints[key];
            }
        }

        let magicValue = this.props.magicValues.default;
        for(key in this.props.magicValues.breakpoints) {
            let unit = getUnit(key);

            if(unit !== "px") {
                throw new Error("Pyramid does not support the unit '" + unit + "' in the property magicValues. You could always help out to implement it and make a pull request ^^ Cheers!");
            }

            if(this.state.pyramidWidth >= parseInt(key)) {
                magicValue = this.props.magicValues.breakpoints[key];
            }
        }

        let key;
        let elements = this.props.children.filter( element => {

            if(!element.props.width) {
                throw new Error("The original width of the element needs to be supplied. This is to maintain aspect ratio.");
                return false;
            }

            if(!element.props.height) {
                throw new Error("The original height of the element needs to be supplied. This is to maintain aspect ratio.");
                return false;
            }

            return true;

        }).map( (element, index, elements) => {
            key = index;

            let elementClassName = this.classes("element").className;
            let elementWidth = (this.state.pyramidWidth - (numberOfColumns + 1) * this.props.gutter ) / numberOfColumns;
            let elementHeight = (elementWidth / element.props.width) * element.props.height;

            let elementProps = {
                top: this.props.gutter,
                left: this.props.gutter,
                width: elementWidth,
                height: elementHeight,
                inView: this.state.allElementProps[key] ? this.state.allElementProps[key].inView : false,
                transition: this.props.transition
            }

            //if the element is NOT in the first row
            if(key >= numberOfColumns) {
                let elementAbove = this.state.allElementProps[key - numberOfColumns];

                if(elementAbove) {
                    elementProps.top = elementAbove.top + elementAbove.height + this.props.gutter;
                }
            } 

            //if the element is NOT the first element in a row
            if(key % numberOfColumns > 0) {
                let elementToTheLeft = this.state.allElementProps[key - 1];

                if(elementToTheLeft) {
                    elementProps.left = elementToTheLeft.left + elementToTheLeft.width + this.props.gutter;
                }
            }

            //if the element is in the last row
            if(key >= (elements.length - numberOfColumns)) {
                elementProps.marginBottom = this.props.gutter;
            }

            //if the element is in view (or close to using magic value)
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

            if(this.props.onElementClick) {
                elementProps.onClick = this.handleClick.bind(this, key);
            }

            this.state.allElementProps[key] = elementProps;

            return (
                <PyramidElement className={elementClassName} key={key} {...elementProps}>
                    {element}
                </PyramidElement>
            )
        });

        return (
            <div ref="pyramid" style={pyramidStyle} {...this.classes()}>
                {elements}
            </div>
        );
    }

    handleClick(key, event) {
        if(this.props.onElementClick) {
            this.props.onElementClick(this.state.allElementProps[key], event);
        }
    }

}