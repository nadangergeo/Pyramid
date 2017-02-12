import React from "react";
import elementResizeDetector from "element-resize-detector";

import "./giphy.css";
import Pyramid from "../../src";

export default class Giphy extends React.Component {
    static propTypes = { 
        zoomedIn: React.PropTypes.bool
    };

    static defaultProps = { 
        zoomedIn: false
    };

    constructor(props) {
        super(props);

        // Create a elementResizeDetector.
        this.erd = props.erd || elementResizeDetector({strategy: "scroll"});

        this.state = {
            gifs: []
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.zoomingIn) {
            this.search("cats");
        }
    }

    componentDidUpdate(prevProps, nextProps) {
        if(nextProps.zoomedIn) {
            this.refs.input.focus();
        }
    }

    componentDidMount() {
        if(this.props.zoomedIn) {
            this.search("trippy");
            this.refs.input.focus();
        }
    }

    handleSearch(event) {
        this.search(event.target.value);
    }

    handleSearchClick(event) {
        event.stopPropagation();
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
        let coverStyle = {
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            zIndex: 500,
            display: "flex",
            height: "100%",
            overflow: "hidden",
            backgroundColor: "#000",
            color: "#fff",
            alignItems: "center",
            justifyContent: "center",
            opacity: 1,
            transition: "all 300ms linear"
        };

        let headerStyle = {
            display: "block",
            textAlign: "center",
            fontSize: "10vw", 
            letterSpacing: "-0.05em"
        }

        if(this.props.zoomedIn) {
            coverStyle.opacity = 0;
        }

        if(this.props.zoomedIn) {
            coverStyle.zIndex = -1000;
        }

        let wrapperStyle = {
            position: "relative",
            height: "100%",
            overflow: "hidden",
            backgroundColor: "#ccc",
        };

        let pyramidStyle = {
            height: "calc(100% - 120px)",
            top: "120px",
            transition: "all 300ms linear"
        };

        let inputContainerStyle = {
            opacity: 0,
            transition: "all 300ms linear"
        };

        if(this.props.zoomedIn) {
            inputContainerStyle.opacity = 1;
        }

        let elements = this.state.gifs.map( (gif, index) => {
            return <img key={index} src={gif.src} width={gif.width} height={gif.height}/>;
        });

        let gifPyramid;
        if(this.props.zoomedIn){
            gifPyramid = (
                <Pyramid erd={this.erd} transition="all 200ms cubic-bezier(.63,-0.43,.33,1.41)" zoomable={true} style={pyramidStyle} derenderIfNotInViewAnymore={true}>
                    {elements}
                </Pyramid>
            );
        } else {
            gifPyramid = null;
        }

        return (
            <div style={wrapperStyle}>
                <div style={coverStyle}>
                    <h1 style={headerStyle}>Giphy</h1>
                </div>

                <div style={inputContainerStyle} className="input-container">
                    <input ref="input" type="search" placeholder="Search Giphy…" onChange={this.handleSearch.bind(this)} onClick={this.handleSearchClick.bind(this)} />
                </div>

                {gifPyramid}
            </div>
        );
    }
}