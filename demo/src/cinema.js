import React from "react";
import elementResizeDetector from "element-resize-detector";

import Pyramid from "../../src";
import Cover from "./cover";
import Film from "./film";

import breakfastAtTiffanys from "./img/cinema/breakfast_at_tiffanys.jpg";
import vertigo from "./img/cinema/vertigo.jpg";

export default class Cinema extends React.Component {
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

        this.filmsData = [
            {
                title: "Breakfast at Tiffany's",
                year: 1961,
                genres: ["comedy", "drama", "romance"],
                summary: "A young New York socialite becomes interested in a young man who has moved into her apartment building, but her past threatens to get in the way.",
                director: ["Blake Edwards"],
                stars: ["Audrey Hepburn", "George Peppard", "Patricia Neal"],
                screenplay: ["George Axelrod"],
                poster: {
                    src: breakfastAtTiffanys,
                    width: 800,
                    height: 1200
                }
            },
            {
                title: "Vertigo",
                year: 1958,
                genres: ["mystery","romance", "thriller"],
                summary: "A San Francisco detective suffering from acrophobia investigates the strange activities of an old friend's wife, all the while becoming dangerously obsessed with her.",
                director: ["Alfred Hitchcock"],
                stars: ["James Stewart", "Kim Novak", "Barbara Bel Geddes"],
                screenplay: ["Samuel A. Taylor", "Alec Coppel"],
                poster: {
                    src: vertigo,
                    width: 800,
                    height: 1200
                }
            }
        ]
    }

    render() {

        const pyramidStyle = {
            height: "calc(100% - 100px)",
            top: "100px",
            zIndex: 1000,
            // height: "100%",
            // position: "static"
        };

        const films = this.filmsData.map( (data, index) => {
            return (<Film data={data} key={index} themeColor={this.props.themeColor} />);
        });

        let filmsPyramid;
        if(this.props.zoomedIn || this.props.zoomingIn || this.props.zoomingOut) {
            filmsPyramid = (
                <Pyramid erd={this.erd} style={pyramidStyle} extraPaddingTop="0">
                    {films}
                </Pyramid>
            );
        } else {
            filmsPyramid = null;
        }

        return (
            <div className="demo">
                <Cover {...this.props} zIndex={!this.props.zoomedOut ? 2000 : 100}>Cinema</Cover>
                {filmsPyramid}
            </div>
        );
    }
}