import React from "react";
import BEMHelper from "react-bem-helper";
import getUnit from "get-unit";
import elementResizeDetector from "element-resize-detector";
import throttle from "lodash.throttle";

import PyramidElement from "./PyramidElement";

export default class Pyramid extends React.Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.erd = elementResizeDetector({strategy: "scroll"});
        this.state = {
            pyramidWidth: null,
            numberOfColumns: 1,
            breakpoints: props.breakpoints ? props.breakpoints : {
                "768px"  : 2,
                "1024px" : 3,
                "1280px" : 4,
                "1440px" : 5 
            },
            gutter: props.gutter ? props.gutter : 20,
            magicValue: props.magicValue ? props.magicValue : 0.2,
            allElementProps: [],
            elements: props.elements ? props.elements : [],
            classes: props.baseClass ? new BEMHelper(props.baseClass) : new BEMHelper("pyramid"),
            strictInViewChecker: false
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            elements: nextProps.elements ? nextProps.elements : this.state.elements
        });
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
            if(this.state.pyramidWidth < 768) {
                this.state.magicValue = 1;
            }
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
                <div ref="pyramid" style={pyramidStyle} {...this.state.classes()}></div>
            )
        }

        this.state.numberOfColumns = 1;

        for(key in this.state.breakpoints) {
            let unit = getUnit(key);

            if(unit !== "px") {
                throw new Error("Pyramid does not support " + unit + "yet. You could always help out to implement it and make a pull request ^^ Cheers!");
            }

            if(this.state.pyramidWidth > parseInt(key)) {
                this.state.numberOfColumns = this.state.breakpoints[key];
            }
        }

        let key;
        let elements = this.state.elements.filter( element => {
            if(!element.src || element.src === "") {
                // console.error("One of the elements does not have a source :-(");
                return false;
            }

            if(!element.orgWidth || element.orgWidth === "0") {
                // console.error("The original width of the element needs to be supplied.");
                return false;
            }

            if(!element.orgHeight || element.orgHeight === "0") {
                // console.error("The original height of the element needs to be supplied.");
                return false;
            }

            return true;
        }).map( (element, index, elements) => {
            key = index;
            let numberOfColumns = this.state.numberOfColumns;
            let elementWidth = (this.state.pyramidWidth - (numberOfColumns + 1) * this.state.gutter ) / numberOfColumns;
            let elementHeight = (elementWidth / element.orgWidth) * element.orgHeight;
            let elementProps = {
                type: element.type,
                src: element.src,
                href: element.href,
                top: this.state.gutter,
                left: this.state.gutter,
                zIndex: 1000,
                width: elementWidth,
                height: elementHeight,
                inView: this.state.allElementProps[key] ? this.state.allElementProps[key].inView : false,
                numberOfColumns: numberOfColumns,
            }

            //if the element is NOT in the first row
            if(key >= numberOfColumns) {
                let elementAbove = this.state.allElementProps[key - numberOfColumns];

                if(elementAbove) {
                    elementProps.top = elementAbove.top + elementAbove.height + this.state.gutter;
                }
            } 

            //if the element is NOT the first element in a row
            if(key % numberOfColumns > 0) {
                let elementToTheLeft = this.state.allElementProps[key - 1];

                if(elementToTheLeft) {
                    elementProps.left = elementToTheLeft.left + elementToTheLeft.width + this.state.gutter;
                }
            }

            //if the element is in the last row
            if(key >= (elements.length - numberOfColumns)) {
                elementProps.marginBottom = this.state.gutter;
            }

            //if the element is in view (or close to using magic value)
            if(
                ( elementProps.top + (this.state.magicValue * this.refs.pyramid.offsetHeight) > this.refs.pyramid.scrollTop
                  &&
                  elementProps.top < ( this.refs.pyramid.scrollTop + this.refs.pyramid.offsetHeight) + (this.state.magicValue * this.refs.pyramid.offsetHeight)
                )
                ||
                ( (elementProps.top + elementProps.height) + (this.state.magicValue * this.refs.pyramid.offsetHeight) > this.refs.pyramid.scrollTop
                  &&
                  elementProps.top + elementProps.height < (this.refs.pyramid.scrollTop + this.refs.pyramid.offsetHeight) + (this.state.magicValue * this.refs.pyramid.offsetHeight)
                )
            ) {
                elementProps.inView = true;
            } else if(this.props.strictInViewChecker) {
                elementProps.inView = false;
            }

            if(this.props.onElementClick) {
                elementProps.onClick = this.handleClick.bind(this, key);
            }

            this.state.allElementProps[key] = elementProps;

            let baseClass = this.state.classes("element").className;

            return (
                <PyramidElement baseClass={baseClass} key={key} {...elementProps}/>
            )
        });

        return (
            <div ref="pyramid" style={pyramidStyle} {...this.state.classes()}>
                {elements}
            </div>
        );
    }

    handleClick(key) {
        if(this.props.onElementClick) {
            this.props.onElementClick(this.state.allElementProps[key]);
        }
    }

}