import { saveAs } from 'file-saver';

const HtmlDownloader = ({ content }) => {
  const handleDownload = () => {
    const blob = new Blob([content], { type: 'text/html;charset=utf-8' });
    saveAs(blob, 'dashboard.html');
  };

  return (
    <button 
      onClick={handleDownload}
      className="download-button"
    >
      Baixar HTML
    </button>
  );
};

export default HtmlDownloader;
