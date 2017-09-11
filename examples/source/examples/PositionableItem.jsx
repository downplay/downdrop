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
        y: 0,
        movedX: 0,
        movedY: 0
    };

    handleDrag = (event, data, context) => {
        this.setState({
            x: this.state.x + this.state.movedX,
            y: this.state.y + this.state.movedY
        });
        this.handleMove(event, data, context);
    };

    handleMove = (event, data, context) => {
        this.setState({ movedX: context.movedX, movedY: context.movedY });
    };

    render() {
        return (
            <DragHandle
                onDrag={this.handleDrag}
                onMove={this.handleMove}
                element={Wrapper}
                style={{
                    left: this.state.x + this.state.movedX,
                    top: this.state.y + this.state.movedY
                }}
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
