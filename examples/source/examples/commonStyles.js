import styled from "react-emotion";

export const ListWrapper = styled.ul`
    display: flex;
    flex-direction: column;
    align-items: center;
`;

export const ItemWrapper = styled.div`
    cursor: pointer;
    border: solid 1px black;
    background-color: #fcc;
    height: 32px;
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const DragWrapper = styled.div`margin: 10px;`;
