import React from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from "react-markdown";

const Content = ({content, bordered}) => (
  <ReactMarkdown className='border-left pl-3' source={content} />
);

Content.propTypes = {
  content: PropTypes.string,
  bordered: PropTypes.bool
};

Content.defaultProps = {
  bordered: false
}

export default Content;