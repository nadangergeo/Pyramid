import React from "react";
import BEMHelper from "react-bem-helper";

class PyramidElement extends React.Component {
    static propTypes = { 
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired,
        top: React.PropTypes.number,
        left: React.PropTypes.number,
        type: React.PropTypes.string,
        className: React.PropTypes.string,
        transition: React.PropTypes.string
    };

    static defaultProps = { 
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        type: "img",
        className: "element",
        transition: "none"
    };

    constructor(props) {
        super(props);
        this.classes = new BEMHelper(props.className);
        this.state = {
            loaded: false
        };
        this.styleNormalizer = {
            margin: 0,
            padding: 0,
            border: 0,
        };
    }

    render() {
        let thisComponent = this;
        let element = this.props.children;

        let containerStyle = Object.assign({}, this.styleNormalizer);
        containerStyle = Object.assign(containerStyle, {
            backgroundColor: "rgba(0,0,0,0.1)",
            display: "block",
            width: this.props.width + "px",
            height: isNaN(this.props.height) ? this.props.height : this.props.height + "px",
            position: "absolute",
            top: this.props.top,
            left: this.props.left,
            transition: this.props.transition,
            marginBottom: this.props.marginBottom + "px",
            cursor: this.props.onClick ? "pointer" : "default"
        });

        let elementStyle = Object.assign({}, this.styleNormalizer);
        if(element.props.style) {
            elementStyle = Object.assign(elementStyle, element.props.style);
        }
        elementStyle = Object.assign(elementStyle, {
            width: "100%",
            height: "auto",
            opacity: this.props.inView && this.state.loaded ? 1 : 0,
            transition: "opacity 300ms linear",
            cursor: element.props.onClick ? "pointer" : "default",
            WebkitTransform: "translateZ(0)", //GPU-acceleration, does it help?
            transform: "translateZ(0)"
        });

        var elementProps = {
            className: this.classes(element.type).className,
            style: elementStyle,
            onLoad: this.handleImageLoaded.bind(this),
            width: null, //nullify because it is not needed anymore
            height: null //nullify because it is not needed anymore
        }

        element = React.cloneElement(element, elementProps);

        return(
            <div style={containerStyle} {...this.classes()} onClick={this.props.onClick}>
                {this.props.inView ? element : ""}
            </div>
        );
    }

    handleImageLoaded() {
        this.setState(
            { loaded : true }
        )
    }
}

export default PyramidElement;