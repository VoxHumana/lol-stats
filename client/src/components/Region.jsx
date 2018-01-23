import React from 'react';
import {
  DropdownItem,
} from 'reactstrap';

export default function Region() {
  return (
    <DropdownItem onClick={this.props.handleClick}>{this.props.region}</DropdownItem>
  );
}
