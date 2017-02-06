import React from "react";
import BEMHelper from "react-bem-helper";

class PyramidElement extends React.PureComponent {
    static propTypes = { 
        width: React.PropTypes.oneOfType([
                    React.PropTypes.string,
                    React.PropTypes.number
                ]).isRequired,
        height: React.PropTypes.oneOfType([
                    React.PropTypes.string,
                    React.PropTypes.number
                ]).isRequired,
        top: React.PropTypes.number,
        left: React.PropTypes.number,
        zIndex: React.PropTypes.oneOfType([
                    React.PropTypes.string,
                    React.PropTypes.number
                ]).isRequired,
        type: React.PropTypes.string,
        style: React.PropTypes.object,
        className: React.PropTypes.string,
        transition: React.PropTypes.string,
        inView: React.PropTypes.bool,
        onClick: React.PropTypes.func,
        zoomedIn: React.PropTypes.bool,
        zoomingIn: React.PropTypes.bool,
        zoomingOut: React.PropTypes.bool
    };

    static defaultProps = { 
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        zIndex: "auto",
        type: "img",
        className: "element",
        transition: "none",
        inView: true,
        onClick: null,
        zoomedIn: false,
        zoomingIn: false,
        zoomingOut: false
    };

    constructor(props) {
        super(props);
        this.mediaTypes = ["img", "video", "audio", "object", "iframe"];
        this.classes = new BEMHelper(props.className);
        this.state = {
            loaded: this.mediaTypes.indexOf(this.props.children.type) !== -1 ? false : true
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
            width: isNaN(this.props.width) ? this.props.width : this.props.width + "px",
            height: isNaN(this.props.height) ? this.props.height : this.props.height + "px",
            position: "absolute",
            top: this.props.top,
            left: this.props.left,
            zIndex: this.props.zIndex,
            transition: this.props.transition,
            cursor: this.props.onClick ? "pointer" : "default"
        });

        if(this.props.style) {
            containerStyle = Object.assign(containerStyle, this.props.style);
        }

        if(this.props.zoomedIn || this.props.zoomingIn) {
            containerStyle = Object.assign(containerStyle, {
                overflowY: "auto",
                MsOverflowStyle: "-ms-autohiding-scrollbar",
                WebkitOverflowScrolling: "touch"
            });
        }

        let elementStyle = Object.assign({}, this.styleNormalizer);
        elementStyle = Object.assign(elementStyle, {
            width: "100%",
            height: this.mediaTypes.indexOf(this.props.children.type) !== -1 && !this.props.zoomedIn && !this.props.zoomingIn && !this.props.zoomingOut ? "100%" : "auto",
            opacity: this.props.inView && this.state.loaded ? 1 : 0,
            transition: "opacity 300ms linear",
            cursor: element.props.onClick ? "pointer" : "inherit",
            boxSizing: "border-box",
            WebkitTransform: "translateZ(0)", //GPU-acceleration, does it help?
            transform: "translateZ(0)"
        });
        if(element.props.style) {
            elementStyle = Object.assign(elementStyle, element.props.style);
        }

        var elementProps = {
            className: this.classes(element.type).className,
            style: elementStyle,
            onLoad: this.mediaTypes.indexOf(element.type) !== -1 ? this.handleImageLoaded.bind(this) : null,
            width: null, //nullify because it is not needed anymore
            height: null, //nullify because it is not needed anymore 
        }

        // if(element.props.src && element.props.src.slice(-3) === "gif") {
        // }

        if(typeof element.type === "function") {
            elementProps.zoomedIn = this.props.zoomedIn;
            elementProps.zoomingIn = this.props.zoomingIn;
            elementProps.zoomingOut = this.props.zoomingOut;
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