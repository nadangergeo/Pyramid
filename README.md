# ▲ Pyramid

[![Travis][build-badge]][build]
[![npm package][npm-badge]][npm]
[![Coveralls][coveralls-badge]][coveralls]

Responsive masonry grid with infinte scroll and lazy loading, built with react.

[build-badge]: https://img.shields.io/travis/user/repo/master.png?style=flat-square
[build]: https://travis-ci.org/user/repo

[npm-badge]: https://img.shields.io/npm/v/npm-package.png?style=flat-square
[npm]: https://www.npmjs.org/package/npm-package

[coveralls-badge]: https://img.shields.io/coveralls/user/repo/master.png?style=flat-square
[coveralls]: https://coveralls.io/github/user/repo

## Todo:

- [ ] Allow passing elements as children (instead?)
- [ ] Allow react components as elements
- [ ] *Super secret plan*

Check out [the dev branch](https://github.com/nadangergeo/Pyramid/tree/dev) to see where this component is headed! It's going to be epic!

## Demo

Fun Giphy example:
http://gergeo.se/pyramid-demo/
(Source in this repo)

Basic example which combines iframes and images:
http://blimp.se/ (source: https://github.com/BlimpBureau/blimpbureau.github.io)

## Install
npm install react-pyramid --save

## Basic usage

```
<Pyramid elements={elements} />
```

Elements is an array of objects, example:

```
elements = [
  {
    type: "img", //not actually needed, since it defaults to img. (optional)
    src: "images/cat.png", //local or external url. (required)
    orgWidth: 1080, //the original width of the image (required)
    orgHeight: 1080 //the original height of the image (required)
    href: "images/cat.png" //give image a link (optional)
  },
  {
    type: "iframe",
    src: "http://foo.bar/dog.html", //required
    orgWidth: 1337, //required
    orgHeight: 1337 //required
  }
]
```

# Props

## elements – Array of objects, required

The array of objects to render. See example above, or check out the source code of the demo.

## numberOfColumns – Object, optional

How many columns should the pyramid have for different breakpoints?
Currently only supports the *px* unit.

**defaults setting:**
```
numberOfColumns: {
  default: 1,
  breakpoints: {
      "768px"  : 2,
      "1024px" : 3,
      "1280px" : 4,
      "1440px" : 5 
   }
}
```

## magicValues: Object, optional

This one is a bit tricky to explain. I will do my best.
- An element is only rendered if it is in view (or if it has already been rendered)
- Basically, when determening whether an element is in view or not, the magicValue is a factor which stretches the boundary so to speak. More concretely, it is "streched" by magicValue * height of pyramid.

This is really nice to have and let's you "preload" elements just before they are scrolled into view.

**defaults setting:**
```
magicValues: {
  default: 0
}
```

**example setting:**
```
magicValues: {
  default: 1,
  breakpoints: {
    "768px" : 0.2
  }
}
```

## baseClass: String, optional

The "block" in BEM, when giving component class names.

Defaults to **"pyramid"**, which in turn gives the element container the class **"pyramid__element"**, and the element **"pyramid__element__[type]"**,
where type is the type of the element (ex: img).

## gutter: Number, optional

The gutter, which is used around the pyramid and between the elements.

**Default:** 20

## transition: String, optional

The CSS transition property value which is applied to all elements.

**Default:** "all 300ms linear".

Apply **"none"** to turn this off.

## derenderIfNotInViewAnymore: Boolean, optional

Should the element be derendered if it is no longer in view? (.ie the user has scrolled past it)

**Default** false

## style: Object, optional

Self explanatory. Used to style the pyramid component.

**Default CSS:**
```
    display: "block",
    position: "relative",
    width: "100%",
    height: "100%",
    clear: "both",
    overflowY: "auto"
```

## onElementClick: Function, optional

In case you want to handle what happenes when clicking on an element.

**Usage example:**

```
handleElementClick(elementProps, event) {
    console.log("elementProps", elementProps);
    console.log("event", event);
}

```
…
```
<Pyramid elements={elements} onElementClick={this.handleElementClick} />
```
