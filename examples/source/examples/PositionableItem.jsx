import React, { Component } from "react";
import { DragDropProvider, DragHandle } from "downdrop";
import styled from "react-emotion";

const Wrapper = styled.div`
    position: absolute;
    width: 200px;
    height: 200px;
    border: solid 1px black;
    cursor: pointer;
`;

class PositionableItem extends Component {
    state = {
        x: 0,
        y: 0
    };
    handleDrag(event, data, context) {
        this.setState({ x: context.offsetX, y: context.offsetY });
    }
    render() {
        return (
            <DragHandle
                onDrag={this.handleDrag}
                onMove={this.handleDrag}
                element={Wrapper}
                style={{ x: this.state.x, y: this.state.y }}
            >
                {this.props.children}
            </DragHandle>
        );
    }
}

export default () => (
    <DragDropProvider>
        <PositionableItem>Drag me!</PositionableItem>
    </DragDropProvider>
);
