import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import CreateButton from "./CreateButton";

const HeartButton = ({className, count, size}) => {
  return (
    <Button outline size={size} color='danger' className={className}>
      <FontAwesomeIcon icon={faHeart}/> {count}
    </Button>
  )
};

HeartButton.propTypes = {
  count: PropTypes.number,
  size: PropTypes.string
};

HeartButton.defaultProps = {
  size: 'md'
};

export default HeartButton;