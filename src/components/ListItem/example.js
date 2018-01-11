import React from 'react';
import { ListItem } from '.';


export default function ListItemExample({ clickHandler }) {
  const onClick = () => clickHandler('onClick', 'clicked it');
  const icon = <span className="fa fa-star" />;
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
      <ListItem
        text="Item 3"
        leftIcon={icon}
        subText="With an icon"
      />
    </div>
  );
}
