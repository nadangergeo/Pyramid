import React from "react";
import ReactDOM from "react-dom";
import BEMHelper from "react-bem-helper";
import elementResizeDetector from "element-resize-detector";
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
        style: React.PropTypes.object,
        className: React.PropTypes.string,
        zoomTransition: React.PropTypes.string,
        inView: React.PropTypes.bool,
        erd: React.PropTypes.object,
        zoomable: React.PropTypes.bool,
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
        className: "element",
        inView: true,
        zoomable: false,
        zoomedIn: false,
        zoomingIn: false,
        zoomingOut: false
    };

    constructor(props) {
        super(props);

        // Create a elementResizeDetector.
        this.erd = props.erd || elementResizeDetector({strategy: "scroll"});

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
            this.erd.listenTo((this.props.height === "auto"), element, this.handleResize.bind(this));
        }

        this.transitionEndEventFunction = this.handleTransitionEnd.bind(this);
        this.refs.elementContainer.addEventListener(transitionUtility.getEndEvent(), this.transitionEndEventFunction, false);
    }

    componentWillUnmount() {
        let element = this.getElementDOMNode();

        // Remove all event listeners
        if(element) {
            this.erd.removeAllListeners(element);
        }
        this.refs.elementContainer.removeEventListener(transitionUtility.getEndEvent(), this.transitionEndEventFunction, false);
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.zoomingIn || this.state.zoomingOut) {
            if(!this.hasZoomTransition()) {
                console.log("no transiton, faking transition end event");
                this.handleTransitionEnd();
            }
        }
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
        if (typeof event === "undefined" || event.propertyName === "width") {
            if(this.state.zoomingIn) {
                this.didZoomIn(event);
            } else if(this.state.zoomingOut) {
                this.didZoomOut(event);
            }
        }
    }

    hasZoomTransition() {
        let style = this.refs.elementContainer.style;
        let computedStyle = window.getComputedStyle(this.refs.elementContainer);

        return parseFloat(style.transitionDuration) > 0 || parseFloat(computedStyle.transitionDuration) > 0;
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
            zoomingOut: false
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
            zoomingOut: true
        });
    }

    didZoomIn(event) {
        if(typeof this.props.onDidZoomIn === "function") {
            this.props.onDidZoomIn();
        }

        this.setState({
            zoomedIn: true,
            zoomingIn: false,
            zoomingOut: false
        });
    }

    didZoomOut(event) {
        if(typeof this.props.onDidZoomOut === "function") {
            this.props.onDidZoomOut();
        }

        this.setState({
            zoomedIn: false,
            zoomingIn: false,
            zoomingOut: false
        });

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

        if(this.state.zoomingIn || this.state.zoomingOut) {
            containerStyle = Object.assign(containerStyle, {
                transition: this.props.zoomTransition ? this.props.zoomTransition : null
            });
        }

        let containerClassesOptions = {
            modifiers: {
                "zoomedIn": this.state.zoomedIn,
                "zoomedOut": !this.state.zoomedIn,
                "zoomingIn": this.state.zoomingIn,
                "zoomingOut": this.state.zoomingOut
            }
        };

        let containerProps = {
            style: containerStyle,
            className: this.classes(containerClassesOptions).className,
            onClick: this.props.zoomable ? this.state.zoomedIn ? this.zoomOut.bind(this) : this.zoomIn.bind(this) : null
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
            // WebkitTransform: "translateZ(0)", //GPU-acceleration, does it help?
            // transform: "translateZ(0)"
        });

        if(element.props.style) {
            elementStyle = Object.assign(elementStyle, element.props.style);
        }

        let elementProps = {
            style: elementStyle,
            onLoad: this.isMediaType() ? this.handleImageLoaded.bind(this) : null,
            width: null, //nullify because it is not needed anymore
            height: null, //nullify because it is not needed anymore
            ref: element.ref ? element.ref : "element",
        }

        if(this.isReactElement()) {
            elementProps.zoomedIn = this.state.zoomedIn;
            elementProps.zoomingIn = this.state.zoomingIn;
            elementProps.zoomingOut = this.state.zoomingOut;
            elementProps.erd = this.erd;
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