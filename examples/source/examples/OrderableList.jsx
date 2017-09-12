import React, { Component } from "react";
import { DragDropProvider, DragHandle, DropTarget } from "downdrop";

import sampleList from "../resources/sampleList";
import { ListWrapper, ItemWrapper, DragWrapper } from "./commonStyles";

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
        dragPosition: null
    };

    mapItems(items = this.state.items, dragPosition = this.state.dragPosition) {
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
        this.setState({ dragIndex: itemIndex });
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

    handleDrop = () => {
        this.setState(prevState => ({
            items: Object.values(
                this.mapItems(prevState.items, prevState.dragPosition)
            ).map(o => o.item),
            dragPosition: null,
            dragIndex: null
        }));
    };

    renderItem = ({ item, index }) => (
        <DropTarget
            key={item}
            data={index}
            onOver={this.handleOver}
            element="li"
        >
            <DragElement data={index} onDrag={this.handleDrag} />
        </DropTarget>
    );

    render = () => (
        <DragDropProvider onDrop={this.handleDrop}>
            <ListWrapper>{this.mapItems().map(this.renderItem)}</ListWrapper>
        </DragDropProvider>
    );
}
