import React from 'react';
import { shallow, mount } from 'enzyme';

import 'jest-styled-components';
import { withTheme } from '../../utils/theme';

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

  it('should hide close icon when hideClose=true', () => {
    const wrapper = shallow(<Dialog active />);
    expect(wrapper.find('i.fa.fa-close').length).toBe(1);
    wrapper.setProps({
      hideClose: true,
    });
    expect(wrapper.find('i.fa.fa-close').length).toBe(0);
  });

  it('should only render child when active', () => {
    const heavyFn = jest.fn();
    const Child = () => {
      heavyFn();
      return <div>Metal</div>;
    };
    const wrapper = mount(
      withTheme(
        <Dialog active={false}>
          <Child />
        </Dialog>
      )
    );
    expect(heavyFn).not.toHaveBeenCalled();
    wrapper.setProps({
      active: true,
    });

    setTimeout(() => {
      expect(heavyFn).toHaveBeenCalledTimes(1);
    }, 0);
  });

  it('should call onClose when pressing esc', () => {
    // mock addEventListener so we can manually call the callback
    // https://github.com/airbnb/enzyme/issues/426
    const eventMap = {};
    document.addEventListener = jest.fn((event, cb) => {
      eventMap[event] = cb;
    });

    const onCloseMock = jest.fn();
    const payload = { key: 'Escape' };
    const wrapper = mount(
      withTheme(<Dialog active={false} onClose={onCloseMock} />)
    );

    expect(onCloseMock).not.toHaveBeenCalled();

    // call addEventListener callback
    eventMap.keydown(payload);
    // should not have been called as not active
    expect(onCloseMock).not.toHaveBeenCalled();

    wrapper.setProps({ active: true });

    // setProps is async
    setTimeout(() => {
      // call addEventListener callback
      eventMap.keydown(payload);

      expect(onCloseMock).toHaveBeenCalledTimes(1);
      expect(onCloseMock).toHaveBeenCalledWith(payload);
    }, 0);
  });
});
