import React from "react";
import ReactDOM from "react-dom";

import CloseButton from "./closeButton";

class ImageViewer extends React.PureComponent {
    static propTypes = {
        zoomable: React.PropTypes.bool,
        inView: React.PropTypes.bool
        
    };

    static defaultProps = { 
        zoomable: true,
        inView: true
    };

    constructor(props) {
        super(props);

        this.state = {
            loaded: false
        }

        this.styleNormalizer = {
            margin: 0,
            padding: 0,
            border: 0,
        };
    }

    handleResize(event) {
        let element = event;
        let width = element.clientWidth;
        let height = element.clientHeight;

        if((!this.state.zoomingIn && !this.state.zoomingOut && !this.state.zoomedIn)) {
            this.props.onResize(this.props.index, width, height);
        }
    }

    handleImageLoaded() {
        this.setState(
            { loaded : true }
        );
    }

    render() {
        let image = this.props.children;

        // Image Viewer
        // ------------------------------------------------------------------------

        let imageViewerStyle = Object.assign({}, this.styleNormalizer);
        imageViewerStyle = Object.assign(imageViewerStyle, {
            backgroundColor: this.props.zoomedIn || this.props.zoomingIn || this.props.zoomingOut ? "black" : "rgba(0,0,0,0.1)",
            width: "100%",
            height: this.props.zoomedIn || this.props.zoomingIn ? "100%" : "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            transition: "backgroundColor 200ms linear"
        });

        // Image
        // ------------------------------------------------------------------------

        let imageContainerStyle = {
            position: "relative",
            width: "100%",
            paddingBottom: ((image.props.height / image.props.width) * 100) + "%",
            cursor: this.props.zoomedOut ? "pointer" : "auto" 
        }

        let imageStyle = Object.assign({}, this.styleNormalizer);
        imageStyle = Object.assign(imageStyle, {
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "auto",
            opacity: this.props.inView && this.state.loaded ? 1 : 0,
            transition: "opacity 300ms linear",
            boxSizing: "border-box",
        });

        let imageProps = {
            style: imageStyle,
            onLoad: this.handleImageLoaded.bind(this),
            width: null,
            height: null
        }

        image= React.cloneElement(image, imageProps);

        return(
            <div style={imageViewerStyle} onClick={this.props.zoomIn}>
                <CloseButton {...this.props}/>

                <div style={imageContainerStyle}>
                    {this.props.inView ? image: ""}
                </div>
            </div>
        );
    }
}

export default ImageViewer;