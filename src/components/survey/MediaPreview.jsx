import React from 'react';
import styled from 'styled-components';
import { useTranslation } from '../../i18n/LanguageContext';

const PreviewContainer = styled.div`
  margin: 1rem 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const VideoContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  overflow: hidden;
  border-radius: 8px;
  background: #000;
  
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

const processYoutubeUrl = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

const MediaPreview = ({ type, url }) => {
  const { t } = useTranslation();
  if (!url) return <PreviewContainer>{t('mediaPreview.enterUrl')}</PreviewContainer>;

  if (type === 'image') {
    return (
      <PreviewContainer>
        <ImagePreview
          src={url.includes('imgur.com') ? `https://i.imgur.com/${url.split('/').pop().split('.')[0]}.jpg` : url}
          alt={t('mediaPreview.imageAlt')}
        />
      </PreviewContainer>
    );
  }

  if (type === 'video') {
    const embedUrl = processYoutubeUrl(url);
    return (
      <PreviewContainer>
        <VideoContainer>
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={t('mediaPreview.videoTitle')}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <p>{t('mediaPreview.invalidYoutubeUrl')}</p>
          )}
        </VideoContainer>
      </PreviewContainer>
    );
  }

  return null;
};

export default MediaPreview;