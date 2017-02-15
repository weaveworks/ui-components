import React from 'react';
import { ListItem } from '.';


export default function ListItemExample({ clickHandler }) {
  const onClick = () => clickHandler('onClick', 'clicked it');
  return (
    <div>
      <ListItem
        text="Item 1"
        />
      <ListItem
        onClick={onClick}
        text="Item 2"
        subText="You can click on this one"
        />
    </div>
  );
}
