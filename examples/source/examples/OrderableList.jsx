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
    state = {
        items: ["foo", "bar", "baz"],
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
        console.log(dragPosition, filtered);
        return filtered;
    }

    handleDrag = (e, itemIndex) => {
        this.setState({ dragIndex: itemIndex });
    };

    handleOver = (e, itemIndex) => {
        console.log(itemIndex);
        this.setState(prevState => ({
            dragPosition:
                itemIndex + (itemIndex === prevState.dragIndex ? 1 : 0)
        }));
    };

    handleDrop = (e, itemIndex) => {
        this.setState(prevState => ({
            items: Object.values(this.mapItems(prevState.items, itemIndex)).map(
                o => o.item
            ),
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
            <DragHandle data={index} onDrag={this.handleDrag}>
                <ItemWrapper>{item}</ItemWrapper>
            </DragHandle>
        </DropTarget>
    );

    render = () => (
        <DragDropProvider onDrop={this.handleDrop}>
            <ListWrapper>{this.mapItems().map(this.renderItem)}</ListWrapper>
        </DragDropProvider>
    );
}
