import React from "react";
import {render} from "react-dom";

import "./index.css";
import Pyramid from "../../src";

class Demo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            gifs: []
        }
    }

    componentDidMount() {
        this.search("trippy");
        this.refs.input.focus();
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

    handleSearch(event) {
        this.search(event.target.value);
    }

    render() {
        const style = {
            height: "100%",
            overflow: "hidden"
        };

        const pyramidStyle = {
            height: "80%"
        };

        const paragraphStyle = {
            padding: "20px",
            fontSize: "16px",
            lineHeight: "1.5",
            fontFamily: "helvetica, sans-serif",
            backgroundColor: "white"
        };

        let elements = [];
        let gifElements = this.state.gifs.map( (gif, index) => {
            return <img onClick={ e => window.open(gif.href, "_blank")} key={index} src={gif.src} width={gif.width} height={gif.height}/>;
        });

        // elements.push(<p style={paragraphStyle} key={"korv1"}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. In pulvinar sollicitudin nisi sit amet ultricies. Quisque eget mattis justo. Nulla elit justo, molestie sit amet erat quis, luctus pharetra enim. Nulla ut nisi egestas, gravida neque auctor, imperdiet sem. Donec id nibh eget leo efficitur ultricies. Suspendisse nibh odio, accumsan eu eleifend non, rutrum a erat. Suspendisse euismod interdum rhoncus. Maecenas a orci non lacus placerat feugiat at ut magna. Nam malesuada ipsum id aliquet tincidunt.</p>);
        // elements.push(<p style={paragraphStyle} key={"korv2"}>korv</p>);
        // elements.push(<p style={paragraphStyle} key={"korv3"}>korv</p>);
        // elements.push(<p style={paragraphStyle} key={"korv4"}>korv</p>);

        elements = elements.concat(gifElements);

        return (
            <div style={style}>
                <div className="input-container">
                    <input ref="input" type="search" placeholder="Search Giphy…" onChange={this.handleSearch.bind(this)} />
                </div>
                <Pyramid style={pyramidStyle} derenderIfNotInViewAnymore={true} onElementClick={ (element, event) => console.log(element, event)}>
                    {elements}
                </Pyramid>
            </div>
        );
    }
}

render(<Demo style="height:100%; width:100%;"/>, document.querySelector('#demo'))
