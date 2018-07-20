import React from 'react';
import { shallow } from 'enzyme';

import Dialog from './Dialog';

describe('<Dialog />', () => {
  it('shows/hides when active/inactive', () => {
    const closeSpy = jest.fn();
    const dialog = shallow(<Dialog active onClose={closeSpy} />);
    expect(dialog.get(0).props.active).toBe(true);
    dialog.find({ text: '' }).simulate('click');
    expect(closeSpy).toBeCalled();
    dialog.setProps({ active: false });
    expect(dialog.get(0).props.active).toBe(false);
  });

  it('runs the action-click handler', () => {
    const actionSpy = jest.fn();
    const dialog = shallow(
      <Dialog active actions={['Submit', 'Cancel']} onActionClick={actionSpy} />
    );
    dialog.find({ text: 'Submit' }).simulate('click');
    expect(actionSpy).toBeCalledWith('Submit');
    dialog.find({ text: 'Cancel' }).simulate('click');
    expect(actionSpy).toBeCalledWith('Cancel');
  });

  it('allows for React elements to be used for actions', () => {
    const newSpy = jest.fn();
    const dialog = shallow(
      <Dialog
        active
        actions={[<div className="user-action" onClick={newSpy} />]}
      />
    );
    dialog.find('.user-action').simulate('click');
    expect(newSpy).toBeCalled();
  });
});
