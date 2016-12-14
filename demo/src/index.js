import React from "react";
import {render} from "react-dom";

import "./index.css";
import Pyramid from "../../src";

class Demo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            elements: []
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
                    orgWidth: image.width,
                    orgHeight: image.height
                }
            });

            return gifs;

        }).then(gifs => {
            // console.dir(gifs);

            _this.setState({
                elements: gifs
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

        return (
            <div style={style}>
                <div className="input-container">
                    <input ref="input" type="search" placeholder="Search Giphy…" onChange={this.handleSearch.bind(this)} />
                </div>
                <Pyramid style={pyramidStyle} elements={this.state.elements} derenderIfNotInViewAnymore={true} />
            </div>
        );
    }
}

render(<Demo style="height:100%; width:100%;"/>, document.querySelector('#demo'))
