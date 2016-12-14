import React from "react";
import BEMHelper from "react-bem-helper";

class PyramidElement extends React.Component {
    static propTypes = { 
        src: React.PropTypes.string.isRequired,
        width: React.PropTypes.number.isRequired,
        height: React.PropTypes.number.isRequired,
        top: React.PropTypes.number,
        left: React.PropTypes.number,
        type: React.PropTypes.string,
        baseClass: React.PropTypes.string
    };

    static defaultProps = { 
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        type: "img",
        baseClass: "element"
    };

    constructor(props) {
        super(props);
        this.classes = new BEMHelper(props.baseClass);
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

        let normalizerCopy = Object.assign({}, this.styleNormalizer);
        let containerStyle = Object.assign(normalizerCopy, {
            backgroundColor: "rgba(0,0,0,0.1)",
            display: "block",
            width: this.props.width + "px",
            height: this.props.height + "px",
            position: "absolute",
            top: this.props.top,
            left: this.props.left,
            transition: this.props.transition
        });

        normalizerCopy = Object.assign({}, this.styleNormalizer);
        let style = Object.assign(normalizerCopy, {
            width: "100%",
            height: "100%",
            marginBottom: this.props.marginBottom + "px",
            opacity: this.props.inView && this.state.loaded ? 1 : 0,
            transition: "opacity 300ms linear",
            cursor: this.props.href || this.props.onClick ? "pointer" : "default",
            WebkitTransform: "translateZ(0)", //GPU-acceleration, does it help?
            transform: "translateZ(0)"
        });

        var elementProps = {
            src: this.props.src,
            className: this.classes(this.props.type).className,
            style: style,
            onLoad: this.handleImageLoaded.bind(this),
            onClick: this.props.onClick || function(event) {
                if(thisComponent.props.href) {
                    window.open(thisComponent.props.href, "_blank");
                }
            }
        }

        var element = React.createElement(this.props.type, elementProps);

        return(
            <div style={containerStyle} {...this.classes()}>
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