# Downdrop

A lightweight and simple to use .

<img src="docs/coverImage.png" width="359" title="What it looks like">

## Latest version: 0.1.0

First release.

## Why another drag-and-drop library?

Arguably the most popular library for drag-and-drop in React is `react-dnd` - which is an excellent and powerful library. In a real world use case, however, I came up against some limitations with it and decided to roll my own. The design decisions that differentiate `downdrop` from other solutions are:

* Use plain mouse and touch events to implement the interface:
  - Entirely avoids the [complexities](http://mereskin.github.io/dnd/) and [brokenness](https://stackoverflow.com/questions/14203734/dragend-dragenter-and-dragleave-firing-off-immediately-when-i-drag) of the HTML5 drag-and-drop API.
  - We don't have to configure the provider with various "backends" to make it functional. It just works. (Note: React Native should eventually be supported with an additional library)
  - No need to do [all this configuration](https://github.com/yahoo/react-dnd-touch-backend/issues/7) for what should be the *default* case of working on both web and mobile
* Minimal API surface area, uses simple components instead of fancy but harder to learn HOCs, get useful results in very little time
* Class-based components turn out to be far more performant for rendering, at least as of React v15, particularly noticable when using drag operations on elemnts in very large lists
* Leave concerns of rendering and state management largely up to the user; fits any state model
* Support nested dragging as a first-class use case, e.g. Trello-like interfaces
* Support multiple simultaneous drag operations (for multi-touch environments)
* Do not support file dragging; this is fundamentally a completely different operation, both conceptually and in terms of implementation

## Usage exmaple

```javascript
import { DropTarget } from "downdrop";

class OrderableList extends Component {
    render() {
        return (
            
        )
    }
}
```

## Installation

```
yarn add downdrop
```

Or `npm` if you prefer.

## Usage

### DragDropProvider Setup

Downdrop utilises a provider component. This can be placed at the top level of your app if you wish, although this is not required; but it must at least wrap all `DragHandle`s and `DropTarget`s that need to work together. You may wish to handle some events at the provider level.

```jsx
import { DragDropProvider } from "downdrop";

<DragDropProvider onDrop={(e,data)=>handleDropped(data)}>
    <App />
</DragDropProvider>
```

#### properties

These properties affect all context menus under this provider.

`onDrop: function(event: SyntheticEvent, data: any)`

Handler to be called when the user ends a drag operation by releasing the mouse

## Examples

Examples are found in https://github.com/downplay/downdrop/tree/master/examples. To run them, clone the repository and execute:

```
npm run build
npm run examples
```

or

```
yarn build
yarn examples
```

Then navigate to `http://127.0.0.1:3311/`

The dev server is hot module enabled so tweak at will.

## Version History

### 0.1.0

First release

## Planned / Roadmap

* Tests
* React Native support

## Bugs and Issues

Please report any other bugs or issues on GitHub: https://github.com/downplay/downdrop

## Copyright

&copy;2017 Downplay Ltd

Distributed under MIT license. See LICENSE for full details.
