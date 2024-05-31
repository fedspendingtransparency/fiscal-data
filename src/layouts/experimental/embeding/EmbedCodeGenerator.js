import React from 'react';

const EmbedCodeGenerator = () => {
  const embedCode = `<iframe src="${window.location.origin}/embed-chart" width="600" height="400" frameborder="1" title="savings bonds chart" />`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(embedCode);
  };

  return (
    <div>
      <textarea value={embedCode} readOnly rows="4" cols="50" />
      <button onClick={copyToClipboard}>Copy Embed Code</button>
    </div>
  );
};

export default EmbedCodeGenerator;
