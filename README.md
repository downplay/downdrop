# Downdrop

Pleasantly simple drag-and-drop for React Web.

## Latest version: 0.2.0

First release.

## Why another drag-and-drop library?

To date there are a number of quality drag-and-drop implementations available for React, ranging from the low-level but powerful (the popular and arguably "de-facto" `react-dnd`) to highly-featured but focussed (`react-beautiful-dnd` or `react-sortable-hoc`). In a real world use case, however, I came up against some limitations in these libraries and decided to roll my own. The design decisions that differentiate `downdrop` from other solutions are:

* Use plain mouse and touch events to implement the interface:
  - Entirely avoids the [complexities](http://mereskin.github.io/dnd/) and [brokenness](https://stackoverflow.com/questions/14203734/dragend-dragenter-and-dragleave-firing-off-immediately-when-i-drag) of the HTML5 drag-and-drop API.
  - We don't have to configure the provider with various "backends" to make it functional. It just works. (Note: React Native should eventually be supported with an additional dependency)
  - No need for [all of this configuration](https://github.com/yahoo/react-dnd-touch-backend/issues/7) for what should be the *default* case of working on both web and mobile
* Minimal API surface area, uses plain components instead of fancy but harder to learn HOCs, get useful results in very little time
* Class-based components turn out to be far more performant for rendering, at least as of React v15, particularly noticable when using drag operations on elemnts in very large lists
* Leave concerns of rendering and state management almost entirely up to the user; fit any state model or backing store, enable any UI paradigm
* Support nested dragging as a first-class use case, e.g. Trello-like interfaces
* Support multiple simultaneous drag operations (for multi-touch environments)
* Do not support file dragging; this is fundamentally a completely different operation, both conceptually and in terms of implementation

## Usage example

The term "drag-and-drop" encompasses a wide variety of different scenarios, so it is not really possible to document any single "default" use case. However, a list that can be rearranged by dragging items might be rendered thusly:

```javascript
import { DragDropProvider, DragHandle DropTarget } from "downdrop";

const DraggableList = ({items, onDrag, onOver, onDrop}) => (
    <DragDropProvider onDrop={this.handleDrop}>
        {this.props.items.map(item => (
            <DropTarget key={item.id} data={item} onOver={this.handleOver}>
                <DragHandle data={item} onDrag={this.handleDrag}>
                    <Item>{item.text}</Item>
                </DragHandle>
            </DropTarget>
        ))}
    </DragDropProvider>
);
```

The implementation details of onDrag, onOver and onDrop, and how they might modify state to provide visual feedback, are left to the developer. More complete reference implementations are provided in the [examples](https://github.com/downplay/downdrop/tree/master/examples/source/examples) but this render example shows off the simplistic nature of the supplied primitives.

## Installation

```
yarn add downdrop
```

Or `npm` if you prefer.

## Usage

### DragDropProvider Setup

Downdrop utilises a provider component. This can be placed at the top level of your app if you wish, although this is not required; but it must at least wrap all `DragHandle`s and `DropTarget`s that need to work together. You may wish to handle some events at the provider level; this allows you to destroy the dragged component during drag yet still respond to events.

```jsx
import { DragDropProvider } from "downdrop";

<DragDropProvider onDrop={(e,data)=>handleDropped(data)}>
    <App />
</DragDropProvider>
```

#### properties

`onDrop: function(event: SyntheticEvent, data: any)`

Handler to be called when the user ends a drag operation by releasing the mouse

`onMove: function(event: SyntheticEvent, data: any, context: eventContext)`

`scrollNearViewportEdge: string(none|both|horizontal|vertical, default:both)`

Whether to automatically scroll when dragging near the viewport edges. Can scroll on either axis, both or none.

`scrollProximity: number(default: 50)`

How near (in pixels) to the edge of the viewport the mouse must be in order to trigger viewport scrolling.

`scrollSpeed: number(default: 10)`

*Maximum* speed at which to scroll, in pixels per second. Scrolling will be faster the nearer the user hsa dragged to the viewport, from 0 at the edge of the promimity bound, up to the maximum when 1 pixel away from the edge.

## Examples

Examples are found in https://github.com/downplay/downdrop/tree/master/examples/source/examples. To run them, clone the repository and execute:

```
yarn build
yarn examples
```

Then navigate to `http://127.0.0.1:3311/`

The dev server is hot module enabled so tweak at will.

## Version History

### Next version

* Scroll when near edge of viewport, see properties `scrollNearViewportEdge`, `scrollProximity`, and `scrollSpeed` of `<DragDropProvider>`.
* Don't begin drag until input has moved a minimum number of pixels, see `minimumDragDistance` property of `<DragDropProvider>`

### 0.2.0

* During drag, supply movedX/movedY coords on a 3rd param
* Fire events down to originating object if it still exists

### 0.1.0

* First release

## Planned / Roadmap

* Tests
* React Native support
* Provide HOC in addition to component primitives 
* Consider shipping some higher-level features, maybe in separate packages; e.g. OrderableList, Positionable

## Bugs and Issues

Please report any other bugs or issues on GitHub: https://github.com/downplay/downdrop

## Copyright

&copy;2017 Downplay Ltd

Distributed under MIT license. See LICENSE for full details.
