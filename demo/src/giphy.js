import React from "react";
import elementResizeDetector from "element-resize-detector";

import "./giphy.css";
import Pyramid from "../../src";
import ImageViewer from "./imageViewer";
import CloseButton from "./closeButton";
import Cover from "./cover";

export default class Giphy extends React.Component {
    static propTypes = {
        zoomable: React.PropTypes.bool
    };

    static defaultProps = { 
        zoomable: true
    };

    constructor(props) {
        super(props);

        // Create a elementResizeDetector.
        this.erd = props.erd || elementResizeDetector({strategy: "scroll"});

        this.state = {
            gifs: [],
            hideSearch: false
        }

        this.defaultSearch = "trippy";
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.zoomingIn) {
            this.search(this.defaultSearch);
        }
    }

    componentDidUpdate(prevProps, nextProps) {
        if(nextProps.zoomedIn) {
            this.refs.input.focus();
        }
    }

    componentDidMount() {
        if(this.props.zoomedIn) {
            this.search(this.defaultSearch);
            this.refs.input.focus();
        }
    }

    handleSearch(event) {
        this.search(event.target.value);
    }

    handleSearchClick(event) {
        event.stopPropagation();
    }

    handlePyramidWillZoomIn(event) {
        this.setState({
            hideSearch: true
        });
    }

    handlePyramidWillZoomOut(event) {
        this.setState({
            hideSearch: false
        });
    }

    search(searchQuery) {
        var _this = this;

        //fetch gifs from giphy
        fetch("http://api.giphy.com/v1/gifs/search?q=" + searchQuery + "&limit=20&api_key=dc6zaTOxFJmzC")
        .then(response => response.json())
        .then(json => {
            let data = json.data;
            let gifs = data.map(gif => {
                let image = gif.images.downsized;

                return {
                    src: image.url,
                    href: image.url,
                    width: image.width,
                    height: image.height
                }
            });

            return gifs;

        }).then(gifs =>{
            //some objects returned by giphy have no src property.
            //we need to filter
            return gifs.filter( gif => {
                if(!gif.src || gif.src === "") {
                    return false;
                }

                return true;
            });
        }).then(gifs => {
            _this.setState({
                gifs: gifs
            });
        });
    }

    render() {
        let demoStyle = {};

        let pyramidStyle = {
            height: this.state.hideSearch ? "100%" : "calc(100% - 200px)",
            top: this.state.hideSearch ? "0px" : "100px",
            bottom: this.state.hideSearch ? "0px" : "100px"
        };

        let inputContainerStyle = {
            // bottom: this.state.hideSearch ? "-120px" : "0px",
        };

        let elements = this.state.gifs.map( (gif, index) => {
            return (
                <ImageViewer key={gif.src}>
                    <img src={gif.src} width={gif.width} height={gif.height}/>
                </ImageViewer>
            );
        });

        let gifPyramid;
        if(this.props.zoomedIn || this.props.zoomingOut){
            let props = {
                erd: this.erd,
                onWillZoomIn: this.handlePyramidWillZoomIn.bind(this),
                onWillZoomOut: this.handlePyramidWillZoomOut.bind(this),
                style: pyramidStyle,
                derenderIfNotInViewAnymore: true
            }

            gifPyramid = (
                <Pyramid {...props}>
                    {elements}
                </Pyramid>
            );
        } else {
            gifPyramid = null;
        }

        return (
            <div className="demo">
                <CloseButton {...this.props}/>
                <Cover {...this.props}>Giphy</Cover>

                <div style={inputContainerStyle} className="input-container">
                    <input ref="input" type="search" placeholder="Search Giphy…" onChange={this.handleSearch.bind(this)} onClick={this.handleSearchClick.bind(this)} />
                </div>

                {gifPyramid}
            </div>
        );
    }
}