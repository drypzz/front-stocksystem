import React, { Component } from 'react';

import { FiChevronDown } from 'react-icons/fi';

import styles from './style.module.css';

export default class Dropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.dropdownRef = React.createRef();
  }

  componentDidMount() {
    document.addEventListener('mousedown', this.handleClickOutside);
    document.addEventListener('keydown', this.handleKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.handleClickOutside);
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  handleClickOutside = (event) => {
    if (this.dropdownRef.current && !this.dropdownRef.current.contains(event.target)) {
      this.setState({ isOpen: false });
    }
  };

  handleKeyDown = (event) => {
    if (event.key === 'Escape') {
      this.setState({ isOpen: false });
    }
  };

  toggleMenu = () => {
    if (!this.props.disabled) {
      this.setState(prevState => ({ isOpen: !prevState.isOpen }));
    }
  };

  handleSelect = (event, optionValue) => {
    event.stopPropagation();
    this.props.onChange(optionValue);
    this.setState({ isOpen: false });
  };

  render() {
    const { options, value, placeholder, icon: Icon, disabled } = this.props;
    const { isOpen } = this.state;

    const selectedOption = options.find(opt => opt.id.toString() === value.toString());
    const displayLabel = selectedOption ? selectedOption.name : placeholder;

    const containerClasses = `${styles.dropdownContainer} ${disabled ? styles.disabled : ''}`;

    return (
      <div
        className={containerClasses}
        onClick={this.toggleMenu}
        ref={this.dropdownRef}
      >
        {Icon && <Icon />}
        <span className={styles.dropdownDisplay} title={displayLabel}>
          {displayLabel}
        </span>
        <FiChevronDown className={`${styles.chevronIcon} ${isOpen ? styles.chevronOpen : ''}`} />

        {isOpen && !disabled && (
          <ul className={styles.dropdownMenu}>
            {options.map(option => (
              <li
                key={option.id}
                className={`${styles.dropdownMenuItem} ${value.toString() === option.id.toString() ? styles.activeItem : ''}`}
                onClick={(event) => this.handleSelect(event, option.id)}
                title={option.name}
              >
                {option.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };
};