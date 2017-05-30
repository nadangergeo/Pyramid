import React from "react";
import elementResizeDetector from "element-resize-detector";

import "./giphy.css";
import Pyramid from "../../src";
import ImageViewer from "./imageViewer";
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
            fullscreen: false
        }

        this.defaultSearch = "cats";
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
            fullscreen: true
        });
    }

    handlePyramidWillZoomOut(event) {
        this.setState({
            fullscreen: false
        });
    }

    search(searchQuery) {
        var _this = this;

        //fetch gifs from giphy
        fetch("http://api.giphy.com/v1/gifs/search?q=" + searchQuery + "&limit=100&api_key=dc6zaTOxFJmzC")
        .then(response => response.json())
        .then(json => {
            let data = json.data;
            let gifs = data.map(gif => {
                let image = gif.images.downsized;
                // let image = gif.images.downsized_still;

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
        const pyramidStyle = {
            height: "100%",
            position: "absolute", // This allows the elements' positions be relative to the demo
            zIndex: "auto",
            top: 0
        };

        const numberOfColumns = {
            default: 1,
            breakpoints: {
                "768px"  : 3,
                "1024px" : 4,
                "1280px" : 5,
                "1440px" : 6
            }
        };

        let inputContainerStyle = {
            bottom: this.props.zoomedIn ? "0" : "-120px",
        }

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
                derenderIfNotInViewAnymore: true,
                numberOfColumns,
                extraPaddingTop: 100,
                extraPaddingBottom: 100
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
                <Cover {...this.props}>Giphy</Cover>

                <div className="input-container" style={inputContainerStyle}>
                    <input ref="input" type="search" placeholder="Search Giphy…" onChange={this.handleSearch.bind(this)} onClick={this.handleSearchClick.bind(this)} />
                </div>

                {gifPyramid}
            </div>
        );
    }
}