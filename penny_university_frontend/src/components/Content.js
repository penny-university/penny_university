import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from "react-markdown";

const Content = ({content, className}) => (
  <ReactMarkdown className={className} source={content} />
);

Content.propTypes = {
  content: PropTypes.string,
  className: PropTypes.string
};

Content.defaultProps = {
  bordered: false
};

export default Content;