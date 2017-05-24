import React from "react";
import ReactDOM from "react-dom";

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

        // Close button
        // ------------------------------------------------------------------------

        let closeButtonStyle = Object.assign({}, this.styleNormalizer);
        closeButtonStyle = {
            display: "block",
            padding: "10px",
            position: "fixed",
            zIndex: 1000,
            top: "20px",
            left: "20px",
            fill: "white",
            backgroundColor: "black",
            opacity: this.props.zoomedIn ? 1 : 0,
            transition: "opacity 200ms linear"
        }

        let closeButton = this.props.zoomingIn || this.props.zoomedIn ? (
            <div style={closeButtonStyle} onClick={this.props.zoomOut}>
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
            </div>
        ) : null;

        // Image
        // ------------------------------------------------------------------------

        let imageContainerStyle = {
            position: "relative",
            width: "100%",
            paddingBottom: ((image.props.height / image.props.width) * 100) + "%"
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
            <div style={imageViewerStyle}>
                {closeButton}

                <div style={imageContainerStyle}>
                    {this.props.inView ? image: ""}
                </div>
            </div>
        );
    }
}

export default ImageViewer;