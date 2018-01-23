import React from 'react';
import {
  DropdownItem,
} from 'reactstrap';

export default function Region(props) {
  return (
    <DropdownItem onClick={props.handleClick}>{props.region}</DropdownItem>
  );
}
