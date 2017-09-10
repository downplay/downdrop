import React from "react";
import { Link } from "react-router-dom";
import styled from "react-emotion";

const Page = styled.div`
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
`;

const Header = styled.h1`
    font-size: 4rem;
    margin: 6rem;
`;

const Menu = styled.ul``;

const MenuItem = styled.li``;

const ItemLink = styled(Link)`
    font-size: 2rem;
    margin: 1rem;
    text-align: center;
`;

const Item = ({ children, ...others }) => (
    <MenuItem>
        <ItemLink {...others}>{children}</ItemLink>
    </MenuItem>
);

// TODO: Why am I rendering a menu by hand when I have a menu rendering system?

export default () => (
    <Page>
        <Header>Downdrop Examples</Header>
        <Menu>
            <Item to="/orderable">Orderable List</Item>
            <Item to="/positionable">Positionable Item</Item>
        </Menu>
    </Page>
);
