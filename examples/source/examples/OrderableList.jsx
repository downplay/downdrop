import React, { Component } from "react";
import { DragDropProvider, DragHandle, DropTarget } from "downdrop";
import styled from "react-emotion";

const ListWrapper = styled.ul`
    display: flex;
    flex-direction: column;
    align-items: stretch;
`;

const ItemWrapper = styled.div`
    cursor: pointer;
    border: solid 1px black;
    background-color: #fcc;
`;

export default class OrderableList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: ["foo", "bar", "baz"],
            dragIndex: null,
            dragPosition: null
        };
    }

    reorderItems(
        items = this.state.items,
        dragPosition = this.state.dragPosition
    ) {
        if (dragPosition === null) {
            return items;
        }
        // List with the original item removed
        const filtered = items
            .slice(0, this.state.dragIndex)
            .concat(this.state.items.slice(this.state.dragIndex + 1));
        // Splice in at one position earlier if after the removed slot
        const spliceIndex =
            dragPosition - (dragPosition > this.state.dragIndex ? 1 : 0);
        filtered.splice(spliceIndex, 0, [items[this.state.dragIndex]]);
        return filtered;
    }

    handleOver = (e, itemIndex) => {
        this.setState(prevState => ({
            dragPosition: itemIndex + (itemIndex === prevState ? 1 : 0)
        }));
    };

    handleDrop = (e, itemIndex) => {
        this.setState(prevState => ({
            items: this.reorderItems(prevState.items, itemIndex),
            dragPosition: null,
            dragIndex: null
        }));
    };

    renderItem = (item, index) => (
        <DropTarget key={item} onOver={this.handleOver} element="li">
            <DragHandle data={index} onDrag={this.handleDrag}>
                <ItemWrapper>{item}</ItemWrapper>
            </DragHandle>
        </DropTarget>
    );

    render = () => (
        <DragDropProvider onDrop={this.handleDrop}>
            <ListWrapper>
                {this.reorderItems().map(this.renderItem)}
            </ListWrapper>
        </DragDropProvider>
    );
}
