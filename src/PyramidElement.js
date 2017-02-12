import React from "react";
import ReactDOM from "react-dom";
import BEMHelper from "react-bem-helper";
import transitionUtility from "transition-utility";

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
        type: React.PropTypes.string,
        style: React.PropTypes.object,
        className: React.PropTypes.string,
        transition: React.PropTypes.string,
        inView: React.PropTypes.bool,
        onWillZoomIn: React.PropTypes.func,
        onWillZoomOut: React.PropTypes.func,
        onDidZoomIn: React.PropTypes.func,
        onDidZoomOut: React.PropTypes.func,
    };

    static defaultProps = { 
        width: 0,
        height: 0,
        top: 0,
        left: 0,
        type: "img",
        className: "element",
        transition: "none",
        inView: true,
        zoomedIn: false,
        zoomingIn: false,
        zoomingOut: false
    };

    constructor(props) {
        super(props);

        this.classes = new BEMHelper(props.className);

        this.state = {
            loaded: this.isMediaType() ? false : true,
            zoomedIn: false,
            zoomingIn: false,
            zoomingOut: false
        };

        this.styleNormalizer = {
            margin: 0,
            padding: 0,
            border: 0,
        };
    }

    componentDidMount() {
        let element = this.getElementDOMNode();

        if(!this.isMediaType()) {
            console.log("listening to resize");
            this.props.erd.listenTo((this.props.height === "auto"), element, this.handleResize.bind(this));
        }

        this.transitionEndEventFunction = this.handleTransitionEnd.bind(this);
        this.refs.elementContainer.addEventListener(transitionUtility.getEndEvent(), this.transitionEndEventFunction, false);
    }

    componentWillUnmount() {
        let element = this.getElementDOMNode();

        // Remove all event listeners
        if(element) {
            this.props.erd.removeAllListeners(element);
        }
        this.refs.elementContainer.removeEventListener(transitionUtility.getEndEvent(), this.transitionEndEventFunction, false);
    }

    getElementDOMNode() {
        let element = this.refs[this.element.ref];

        if(this.isReactElement()) {
            element = ReactDOM.findDOMNode(element);
        }

        return element;
    }

    handleResize(event) {
        let element = event;
        let width = element.clientWidth;
        let height = element.clientHeight;

        if((!this.state.zoomingIn && !this.state.zoomingOut && !this.state.zoomedIn)) {
            this.props.onResize(this.props.index, width, height);
        }
    }

    handleTransitionEnd(event) {
        if (event.propertyName === "width") {
            if(this.state.zoomingIn) {
                this.didZoomIn(event);
            } else if(this.state.zoomingOut) {
                this.didZoomOut(event);
            }
        }
    }

    handleImageLoaded() {
        this.setState(
            { loaded : true }
        )
    }

    isMediaType() {
        return ["img", "video", "audio", "object", "iframe"].indexOf(this.props.children.type) !== -1;
    }

    isReactElement() {
        return (typeof this.props.children.type === "function");
    }

    zoomIn(event) {
        event.stopPropagation();

        if(typeof this.props.onWillZoomIn === "function") {
            this.props.onWillZoomIn();
        }

        this.setState({
            zoomedIn: false,
            zoomingIn: true,
            zoomingOut: false,
        });
    }

    zoomOut(event) {
        event.stopPropagation();

        if(typeof this.props.onWillZoomOut === "function") {
            this.props.onWillZoomOut();
        }

        this.setState({
            zoomedIn: false,
            zoomingIn: false,
            zoomingOut: true,
        });
    }

    didZoomIn(event) {
        if(typeof this.props.onDidZoomIn === "function") {
            this.props.onDidZoomIn();
        }

        this.setState({
            zoomedIn: true,
            zoomingIn: false,
            zoomingOut: false,
        });
    }

    didZoomOut(event) {
        if(typeof this.props.onDidZoomOut === "function") {
            this.props.onDidZoomOut();
        }

        this.setState({
            zoomedIn: false,
            zoomingIn: false,
            zoomingOut: false,
        });

        console.log(this.props.height);
        if(!this.isMediaType()) {
            this.props.onResize(this.props.index, this.props.width, this.props.height);
        }
    }

    render() {
        let element = this.props.children;

        // Element container
        // ------------------------------------------------------------------------

        let containerStyle = Object.assign({}, this.styleNormalizer);
        containerStyle = Object.assign(containerStyle, {
            backgroundColor: "rgba(0,0,0,0.1)",
            display: "block",
            width: isNaN(this.props.width) ? this.props.width : this.props.width + "px",
            height: isNaN(this.props.height) ? this.props.height : this.props.height + "px",
            position: "absolute",
            top: this.props.top,
            left: this.props.left,
            zIndex: this.state.zoomedIn || this.state.zoomingIn || this.state.zoomingOut ? 1000 : "auto",
            transition: this.state.zoomingIn || this.state.zoomingOut ? this.props.transition : "none",
            cursor: this.props.zoomable ? "pointer" : "default"
        });

        if(element.props.center) {
            containerStyle = Object.assign(containerStyle, {
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
            });
        }

        if(this.props.style) {
            containerStyle = Object.assign(containerStyle, this.props.style);
        }

        if(this.state.zoomedIn || this.state.zoomingIn) {
            containerStyle = Object.assign(containerStyle, {
                top: this.props.pyramidScrollTop,
                left: 0,
                width: "100%",
                height: "100%",
                overflowY: "auto",
                MsOverflowStyle: "-ms-autohiding-scrollbar",
                WebkitOverflowScrolling: "touch",
                backgroundColor: "black"
            });
        }

        let containerProps = {
            style: containerStyle,
            className: this.classes().className,
            onClick: this.state.zoomedIn ? this.zoomOut.bind(this) : this.zoomIn.bind(this)
        }

        // Element
        // ------------------------------------------------------------------------

        let elementStyle = Object.assign({}, this.styleNormalizer);
        elementStyle = Object.assign(elementStyle, {
            width: "100%",
            height: "auto",
            opacity: this.props.inView && this.state.loaded ? 1 : 0,
            transition: "opacity 300ms linear",
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
            onLoad: this.isMediaType() ? this.handleImageLoaded.bind(this) : null,
            width: null, //nullify because it is not needed anymore
            height: null, //nullify because it is not needed anymore
            ref: element.ref ? element.ref : "element"
        }

        if(this.isReactElement()) {
            elementProps.zoomedIn = this.state.zoomedIn;
            elementProps.zoomingIn = this.state.zoomingIn;
            elementProps.zoomingOut = this.state.zoomingOut;
        }

        this.element = React.cloneElement(element, elementProps);

        return(
            <div ref="elementContainer" {...containerProps}>
                {this.props.inView || !this.isMediaType() ? this.element : ""}
            </div>
        );
    }
}

export default PyramidElement;