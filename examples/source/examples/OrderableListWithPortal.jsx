import React, { Component } from "react";

import { DragDropProvider, DragHandle, DropTarget } from "downdrop";
import Portal from "react-portal";
import styled from "react-emotion";

import sampleList from "../resources/sampleList";
import { ListWrapper, ItemWrapper, DragWrapper } from "./commonStyles";

// TODO: Make these available as a helper lib?
const windowOffset = () => ({
    x: window.pageXOffset || document.documentElement.scrollLeft,
    y: window.pageYOffset || document.documentElement.scrollTop
});

const boundsToAbsolute = bounds => {
    const offset = windowOffset();
    return {
        x: bounds.x + offset.x,
        y: bounds.y + offset.y,
        width: bounds.width, // TODO: right, bottom instead?
        height: bounds.height
    };
};

const getSourceBounds = node => boundsToAbsolute(node.getBoundingClientRect());

const AbsoluteContainer = styled.div`
    position: absolute;
    left: 0;
    top: 0;
    /* Disable pointer events so we can still detect dragging over items underneath */
    pointer-events: none;
`;

const DragElement = ({ children, ...props }) => (
    <DragHandle element={DragWrapper} {...props}>
        <ItemWrapper>
            <span>{children}</span>
        </ItemWrapper>
    </DragHandle>
);

export default class OrderableList extends Component {
    state = {
        items: sampleList,
        dragIndex: null,
        dragPosition: null,
        sourceBounds: {},
        movedX: 0,
        movedY: 0
    };

    mapItems(items = this.state.items, dragPosition = this.state.dragPosition) {
        // TODO: Convoluted as copied from previous example. Can be simplified a lot.
        const mapped = items.map((item, index) => ({ item, index }));
        if (dragPosition === null) {
            return mapped;
        }
        // List with the original item removed
        const filtered = mapped
            .slice(0, this.state.dragIndex)
            .concat(mapped.slice(this.state.dragIndex + 1));
        // Splice in at one position earlier if after the removed slot
        const spliceIndex =
            dragPosition - (dragPosition > this.state.dragIndex ? 1 : 0);
        filtered.splice(spliceIndex, 0, mapped[this.state.dragIndex]);
        return filtered;
    }

    handleDrag = (e, itemIndex) => {
        const sourceBounds = getSourceBounds(e.target);
        this.setState({ dragIndex: itemIndex, sourceBounds });
    };

    handleOver = (e, itemIndex) => {
        if (itemIndex === this.state.dragIndex) {
            return;
        }
        this.setState(prevState => ({
            dragPosition:
                itemIndex + (itemIndex >= prevState.dragPosition ? 1 : 0)
        }));
    };

    handleDrop = (e, itemIndex) => {
        this.setState(prevState => ({
            items: Object.values(this.mapItems(prevState.items, itemIndex)).map(
                o => o.item
            ),
            dragPosition: null,
            dragIndex: null,
            sourceBounds: {},
            movedX: 0,
            movedY: 0
        }));
    };

    handleMove = (e, itemIndex, { movedX, movedY }) => {
        this.setState({ movedX, movedY });
    };

    renderItem = (item, index) => (
        // Render the items but leave a gap for the one being dragged
        <DropTarget
            key={item}
            data={index}
            onOver={this.handleOver}
            element="li"
        >
            <DragElement data={index} onDrag={this.handleDrag}>
                {item}
            </DragElement>
        </DropTarget>
    );

    render = () => {
        const {
            items,
            dragIndex,
            sourceBounds: { x, y },
            movedX,
            movedY
        } = this.state;
        let transform;
        if (dragIndex !== null) {
            transform = {
                transform: `translate(${x + movedX}px, ${y + movedY}px)`
            };
        }
        return (
            <div>
                <DragDropProvider
                    onDrop={this.handleDrop}
                    onMove={this.handleMove}
                >
                    <ListWrapper>{items.map(this.renderItem)}</ListWrapper>
                </DragDropProvider>
                {dragIndex === null ? null : (
                    <Portal isOpened>
                        <AbsoluteContainer style={transform}>
                            <ItemWrapper>
                                <span>{items[dragIndex]}</span>
                            </ItemWrapper>
                        </AbsoluteContainer>
                    </Portal>
                )}
            </div>
        );
    };
}
