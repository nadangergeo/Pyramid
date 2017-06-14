import React from "react";
import elementResizeDetector from "element-resize-detector";

import Pyramid from "../../src";
import Cover from "./cover";
import Film from "./film";

import breakfastAtTiffanys from "./img/cinema/breakfast_at_tiffanys.jpg";
import vertigo from "./img/cinema/vertigo.jpg";
import forbiddenPlanet from "./img/cinema/forbidden_planet.jpg";
import howToStealAMillion from "./img/cinema/how_to_steal_a_million.jpg";
import theGreatEscape from "./img/cinema/the_great_escape.jpg";
import psycho from "./img/cinema/psycho.jpg";
import twelveAngryMen from "./img/cinema/12_angry_men.jpg";
import aClockworkOrange from "./img/cinema/a_clockwork_orange.jpg";
import spaceOdyssey from "./img/cinema/2001_a_space_odyssey.jpg";
import westSideStory from "./img/cinema/west_side_story.jpg";

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
				genres: ["Comedy", "Drama", "Romance"],
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
				genres: ["Mystery","Romance", "Thriller"],
				summary: "A San Francisco detective suffering from acrophobia investigates the strange activities of an old friend's wife, all the while becoming dangerously obsessed with her.",
				director: ["Alfred Hitchcock"],
				stars: ["James Stewart", "Kim Novak", "Barbara Bel Geddes"],
				screenplay: ["Samuel A. Taylor", "Alec Coppel"],
				poster: {
					src: vertigo,
					width: 800,
					height: 1200
				}
			},
			{
				title: "Forbidden Planet",
				year: 1956,
				genres: ["Science Fiction"],
				summary: "Captain Adams and the crew of the Starship C57D fly towards planet Altair 4 in search for the Bellerphon spaceship that has been missing for twenty years. To their surprise they are already being expected. A classic science fiction film from 1957 starring Leslie Nielsen.",
				director: ["Fred M. Wilcox"],
				stars: ["Walter Pidgeon", "Anne Francis", "Leslie Nielsen"],
				screenplay: ["Cyril Hume"],
				poster: {
					src: forbiddenPlanet,
					width: 1000,
					height: 1500
				}
			},
			{
				title: "12 Angry Men",
				year: 1957,
				genres: ["Drama"],
				summary: "The defense and the prosecution have rested and the jury is filing into the jury room to decide if a young Spanish-American is guilty or innocent of murdering his father. What begins as an open and shut case soon becomes a mini-drama of each of the jurors' prejudices and preconceptions about the trial, the accused, and each other.",
				director: ["Sidney Lumet"],
				stars: ["Henry Fonda", "Martin Balsam", "John Fiedler"],
				screenplay: ["Reginald Rose"],
				poster: {
					src: twelveAngryMen,
					width: 1000,
					height: 1500
				}
			},
			{
				title: "Psycho",
				year: 1960,
				genres: ["Drama","Horror","Thriller"],
				summary: "When larcenous real estate clerk Marion Crane goes on the lam with a wad of cash and hopes of starting a new life, she ends up at the notorious Bates Motel, where manager Norman Bates cares for his housebound mother. The place seems quirky, but fine… until Marion decides to take a shower.",
				director: ["Alfred Hitchcock"],
				stars: ["Anthony Perkins", "Vera Miles", "John Gavin"],
				screenplay: ["Joseph Stefano"],
				poster: {
					src: psycho,
					width: 1000,
					height: 1500
				}
			},
			{
				title: "How to Steal a Million",
				year: 1966,
				genres: ["Comedy","Crime","Romance"],
				summary: "A woman must steal a statue from a Paris museum to help conceal her father's art forgeries.",
				director: ["William Wyler"],
				stars: ["Audrey Hepburn", "Peter O'Toole"],
				screenplay: ["Harry Kurnitz"],
				poster: {
					src: howToStealAMillion,
					width: 1000,
					height: 1500
				}
			},
			{
				title: "The Great Escape",
				year: 1963,
				genres: ["Adventure","Drama","History","Thriller","War"],
				summary: "The Nazis, exasperated at the number of escapes from their prison camps by a relatively small number of Allied prisoners, relocates them to a high-security 'escape-proof' camp to sit out the remainder of the war. Undaunted, the prisoners plan one of the most ambitious escape attempts of World War II. Based on a true story.",
				director: ["John Sturges"],
				stars: ["Steve McQueen", "James Garner", "Richard Attenborough"],
				screenplay: ["W.R. Burnett", "James Clavell"],
				poster: {
					src: theGreatEscape,
					width: 1000,
					height: 1500
				}
			},
			{
				title: "A Clockwork Orange",
				year: 1971,
				genres: ["Science Fiction","Drama"],
				summary: "Demonic gang-leader Alex goes on the spree of rape, mugging and murder with his pack of “droogs”. But he's a boy who also likes Beethoven's Ninth and a bit of “the old in-out, in-out”. He later finds himself at the mercy of the state and its brainwashing experiment designed to take violence off the streets.",
				director: ["Stanley Kubrick"],
				stars: ["Malcolm McDowell", "Patrick Magee", "Adrienne Corri"],
				screenplay: ["Stanley Kubrick"],
				poster: {
					src: aClockworkOrange,
					width: 1000,
					height: 1500
				}
			},
			{
				title: "2001: A Space Odyssey",
				year: 1968,
				genres: ["Science Fiction","Mystery","Adventure"],
				summary: "Humanity finds a mysterious object buried beneath the lunar surface and sets off to find its origins with the help of HAL 9000, the world's most advanced super computer.",
				director: ["Stanley Kubrick"],
				stars: ["Keir Dullea", "Gary Lockwood", "William Sylvester"],
				screenplay: ["Arthur C. Clarke", "Stanley Kubrick"],
				poster: {
					src: spaceOdyssey,
					width: 1000,
					height: 1500
				}
			},
			{
				title: "West Side Story",
				year: 1961,
				genres: ["Science Fiction","Mystery","Adventure"],
				summary: "In the slums of the upper West Side of Manhattan, New York, a gang of Polish-American teenagers called the Jets compete with a rival gang of recently immigrated Puerto Ricans, the Sharks, to “own” the neighborhood streets. Tensions are high between the gangs but two kids, one from each rival gang, fall in love leading to tragedy.",
				director: ["Robert Wise"],
				stars: ["Natalie Wood", "Richard Beymer", "Russ Tamblyn"],
				screenplay: ["Jerome Robbins", "Arthur Laurents", "Ernest Lehman"],
				poster: {
					src: westSideStory,
					width: 1000,
					height: 1500
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